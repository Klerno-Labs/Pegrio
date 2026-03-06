import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  try {
    const { showcaseId, name, price, niche } = await req.json()

    if (!showcaseId || !name || !price) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${name} — Pre-Built Website`,
              description: `Ready-to-launch ${niche} website with full source code and setup guide.`,
            },
            unit_amount: price, // already in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_type: 'showcase_purchase',
        showcase_id: showcaseId,
        showcase_name: name,
        niche: niche,
        timestamp: new Date().toISOString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pegrio.com'}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pegrio.com'}/store/${showcaseId}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('Showcase checkout error:', message)
    return NextResponse.json({ message }, { status: 500 })
  }
}
