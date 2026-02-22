'use client'

import MotionReveal from '@/components/MotionReveal'
import { comingSoonApps } from '@/data/apps'
import { Sparkles, UtensilsCrossed, Wrench, Dumbbell } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  UtensilsCrossed,
  Wrench,
  Dumbbell,
}

export default function ComingSoonGrid() {
  return (
    <section className="section bg-gray-bg">
      <div className="container">
        <MotionReveal>
          <h2 className="text-center mb-4">Coming Soon</h2>
          <p className="text-center text-gray-muted mb-12 max-w-2xl mx-auto">
            More industry-specific apps in development. Get notified when yours is ready.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {comingSoonApps.map((app, i) => {
            const Icon = iconMap[app.icon]
            return (
              <MotionReveal key={app.id} animation="fade-up" delay={i * 80}>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center opacity-75 hover:opacity-100 hover:border-blue-accent/40 transition-all">
                  {Icon && (
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 mb-4">
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1">{app.name}</h3>
                  <p className="text-sm text-gray-muted mb-4">{app.tagline}</p>
                  <button className="text-sm font-semibold text-blue-accent hover:underline">
                    Notify Me →
                  </button>
                </div>
              </MotionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
