import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    // Initialize Stripe at runtime to avoid build-time errors
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    })

    const { packageId, packageName, basePrice, paymentType } = await req.json()

    // Calculate the price based on payment type
    let amount: number
    let description: string

    switch (paymentType) {
      case 'full':
        amount = Math.round(basePrice * 0.95 * 100) // 5% discount, convert to cents
        description = `${packageName} Package - Pay in Full (5% discount)`
        break
      case 'split':
        amount = Math.round((basePrice / 2) * 100) // 50% down payment
        description = `${packageName} Package - 50% Down Payment`
        break
      case 'monthly':
        amount = Math.round(((basePrice - 2000) / 10) * 100) // Monthly payment
        description = `${packageName} Package - Monthly Payment 1 of 10`
        break
      default:
        amount = basePrice * 100
        description = `${packageName} Package`
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageName} Website Package`,
              description: description,
              images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'], // Restaurant image
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/#packages`,
      metadata: {
        packageId,
        packageName,
        basePrice: basePrice.toString(),
        paymentType,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
