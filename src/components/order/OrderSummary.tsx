'use client'

import { motion } from 'framer-motion'
import { tiers } from './TierSelector'
import { maintenancePlans } from './MaintenanceSelector'
import type { AddOn } from './AddOnSelector'

interface OrderSummaryProps {
  tier: number | null
  maintenancePlan: string | null
  addOns: AddOn[]
  showDeposit?: boolean
}

export function calculateOrderTotal(
  tier: number | null,
  maintenancePlan: string | null,
  addOns: AddOn[]
) {
  const selectedTier = tiers.find(t => t.id === tier)
  const selectedPlan = maintenancePlans.find(p => p.id === maintenancePlan)

  const tierPrice = selectedTier?.price || 0
  const maintenancePrice = selectedPlan?.price || 0

  let addOnsTotal = 0
  for (const addOn of addOns) {
    const qty = addOn.quantity || 1
    addOnsTotal += addOn.price * qty
  }

  const oneTimeTotal = tierPrice + addOnsTotal
  const depositAmount = Math.round(oneTimeTotal * 0.5)
  const balanceAmount = oneTimeTotal - depositAmount

  return {
    tierPrice,
    tierName: selectedTier?.name || '',
    maintenancePrice,
    maintenanceName: selectedPlan?.name || '',
    addOnsTotal,
    oneTimeTotal,
    depositAmount,
    balanceAmount,
    monthlyTotal: maintenancePrice,
  }
}

export default function OrderSummary({ tier, maintenancePlan, addOns, showDeposit = true }: OrderSummaryProps) {
  const totals = calculateOrderTotal(tier, maintenancePlan, addOns)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border-2 border-white/10 bg-white/5 p-6"
    >
      <h3 className="text-lg font-bold text-white mb-4 font-display">Order Summary</h3>

      <div className="space-y-3">
        {/* Tier line item */}
        {tier && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">{totals.tierName} Website Build</span>
            <span className="text-sm font-semibold text-white">
              ${totals.tierPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* Add-on line items */}
        {addOns.map(addOn => {
          const qty = addOn.quantity || 1
          return (
            <div key={addOn.id} className="flex justify-between items-center">
              <span className="text-sm text-gray-300">
                {addOn.name}
                {qty > 1 && ` x${qty}`}
              </span>
              <span className="text-sm font-semibold text-white">
                ${(addOn.price * qty).toLocaleString()}
              </span>
            </div>
          )
        })}

        {/* Divider */}
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-white">One-Time Total</span>
            <span className="text-lg font-bold text-white">
              ${totals.oneTimeTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Deposit breakdown */}
        {showDeposit && totals.oneTimeTotal > 0 && (
          <>
            <div className="border-t border-white/10 pt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-accent font-semibold">
                  50% Deposit Due Today
                </span>
                <span className="text-lg font-bold text-purple-accent">
                  ${totals.depositAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Balance due at launch</span>
                <span className="text-sm text-gray-400">
                  ${totals.balanceAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Maintenance plan */}
        {maintenancePlan && maintenancePlan !== 'none' && totals.maintenancePrice > 0 && (
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">
                {totals.maintenanceName} Maintenance
              </span>
              <span className="text-sm font-semibold text-white">
                ${totals.maintenancePrice}/mo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Monthly billing starts after website launch
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
