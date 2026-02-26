'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import TierSelector from '@/components/order/TierSelector'
import MaintenanceSelector from '@/components/order/MaintenanceSelector'
import AddOnSelector from '@/components/order/AddOnSelector'
import OrderSummary, { calculateOrderTotal } from '@/components/order/OrderSummary'
import type { AddOn } from '@/components/order/AddOnSelector'

const STEPS = [
  { id: 1, label: 'Choose Plan' },
  { id: 2, label: 'Maintenance' },
  { id: 3, label: 'Add-Ons' },
  { id: 4, label: 'Review & Pay' },
]

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full" />
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  )
}

function OrderPageContent() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-select tier from URL param
  useEffect(() => {
    const tierParam = searchParams.get('tier')
    if (tierParam) {
      const tierNum = parseInt(tierParam, 10)
      if ([1, 2, 3].includes(tierNum)) {
        setSelectedTier(tierNum)
      }
    }
  }, [searchParams])

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1: return selectedTier !== null
      case 2: return selectedMaintenance !== null
      case 3: return true // add-ons are optional
      case 4: return agreedToTerms
      default: return false
    }
  }, [currentStep, selectedTier, selectedMaintenance, agreedToTerms])

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleAddOnToggle = (addOn: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.id === addOn.id)
      if (exists) {
        return prev.filter(a => a.id !== addOn.id)
      }
      return [...prev, { ...addOn, quantity: addOn.hasQuantity ? 1 : undefined }]
    })
  }

  const handleQuantityChange = (addOnId: string, quantity: number) => {
    setSelectedAddOns(prev =>
      prev.map(a => a.id === addOnId ? { ...a, quantity } : a)
    )
  }

  const handleCheckout = async () => {
    if (!selectedTier || !agreedToTerms) return
    setIsSubmitting(true)
    setError(null)

    const totals = calculateOrderTotal(selectedTier, selectedMaintenance, selectedAddOns)

    try {
      // Build descriptive package name
      const tierNames: Record<number, string> = { 1: 'Starter', 2: 'Growth', 3: 'Enterprise' }
      const packageName = `${tierNames[selectedTier]} Website Build`

      // Build line items description for add-ons
      const addOnNames = selectedAddOns.map(a => {
        const qty = a.quantity || 1
        return qty > 1 ? `${a.name} x${qty}` : a.name
      })

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName,
          price: totals.depositAmount, // 50% deposit
          paymentType: 'deposit',
          customerEmail: '', // Stripe will collect this
          customerName: '',
          metadata: {
            order_type: 'website_build',
            tier: selectedTier.toString(),
            maintenance_plan: selectedMaintenance || 'none',
            add_ons: JSON.stringify(selectedAddOns.map(a => ({
              id: a.id,
              name: a.name,
              price: a.price,
              quantity: a.quantity || 1,
            }))),
            total_amount: totals.oneTimeTotal.toString(),
            deposit_amount: totals.depositAmount.toString(),
            balance_amount: totals.balanceAmount.toString(),
            add_on_names: addOnNames.join(', '),
            timestamp: new Date().toISOString(),
          },
        }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.sessionId) {
        // Fallback: use Stripe.js redirect
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`
      } else {
        throw new Error(data.message || 'Failed to create checkout session')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const totals = calculateOrderTotal(selectedTier, selectedMaintenance, selectedAddOns)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Header */}
      <div className="pt-28 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-display mb-3">
            Build Your Website
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your plan, customize your build, and get started today.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                    ${currentStep > step.id
                      ? 'bg-purple-accent text-white'
                      : currentStep === step.id
                        ? 'bg-purple-accent text-white shadow-[0_0_20px_rgba(107,63,160,0.4)]'
                        : 'bg-white/10 text-gray-500'
                    }
                  `}
                >
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span className={`
                  text-xs mt-2 font-medium hidden sm:block
                  ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-3 transition-all duration-500
                  ${currentStep > step.id ? 'bg-purple-accent' : 'bg-white/10'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Plan */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-display mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-gray-400">
                  Select the website package that fits your business needs.
                </p>
              </div>
              <TierSelector selectedTier={selectedTier} onSelect={setSelectedTier} />
            </motion.div>
          )}

          {/* Step 2: Maintenance */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-display mb-2">
                  Ongoing Maintenance
                </h2>
                <p className="text-gray-400">
                  Keep your site fast, secure, and up-to-date after launch.
                </p>
              </div>
              <MaintenanceSelector
                selectedPlan={selectedMaintenance}
                onSelect={setSelectedMaintenance}
              />
            </motion.div>
          )}

          {/* Step 3: Add-Ons */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-display mb-2">
                  Power Up Your Site
                </h2>
                <p className="text-gray-400">
                  Add extra features to supercharge your website. All add-ons are optional.
                </p>
              </div>
              <AddOnSelector
                selectedAddOns={selectedAddOns}
                onToggle={handleAddOnToggle}
                onQuantityChange={handleQuantityChange}
              />
            </motion.div>
          )}

          {/* Step 4: Review & Pay */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-display mb-2">
                  Review Your Order
                </h2>
                <p className="text-gray-400">
                  Confirm your selections and proceed to secure checkout.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <OrderSummary
                  tier={selectedTier}
                  maintenancePlan={selectedMaintenance}
                  addOns={selectedAddOns}
                  showDeposit={true}
                />

                {/* Payment info card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-purple-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Secure Payment via Stripe</h4>
                      <p className="text-xs text-gray-400">
                        You will pay a 50% deposit now (${totals.depositAmount.toLocaleString()}).
                        The remaining balance of ${totals.balanceAmount.toLocaleString()} is due upon project completion,
                        before launch. All payments are securely processed by Stripe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <button
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`
                      w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all mt-0.5
                      ${agreedToTerms
                        ? 'bg-purple-accent border-purple-accent'
                        : 'border-white/30 group-hover:border-white/50'
                      }
                    `}
                  >
                    {agreedToTerms && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-gray-300">
                    I agree to the project terms and understand that the 50% deposit is non-refundable.
                    The remaining balance is due before the website goes live.
                  </span>
                </label>

                {/* Error message */}
                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handleCheckout}
                  disabled={!agreedToTerms || isSubmitting}
                  className={`
                    w-full py-4 rounded-xl text-lg font-bold transition-all duration-300
                    ${agreedToTerms && !isSubmitting
                      ? 'bg-purple-accent text-white hover:bg-purple-accent/90 shadow-[0_0_30px_rgba(107,63,160,0.3)] hover:shadow-[0_0_40px_rgba(107,63,160,0.5)] cursor-pointer'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting to Checkout...
                    </span>
                  ) : (
                    `Pay $${totals.depositAmount.toLocaleString()} Deposit Now`
                  )}
                </button>

                <p className="text-center text-xs text-gray-500">
                  You will be redirected to Stripe for secure payment processing.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 max-w-2xl mx-auto">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300
                ${canProceed()
                  ? 'bg-purple-accent text-white hover:bg-purple-accent/90 shadow-[0_0_20px_rgba(107,63,160,0.25)] cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
                }
              `}
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Floating summary on steps 2-3 */}
        {(currentStep === 2 || currentStep === 3) && selectedTier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <OrderSummary
              tier={selectedTier}
              maintenancePlan={selectedMaintenance}
              addOns={selectedAddOns}
              showDeposit={false}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
