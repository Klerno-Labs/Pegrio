'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { animationVariants, smoothTransition } from '@/lib/motion'

interface MotionRevealProps {
  children: ReactNode
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-in'
  delay?: number
  className?: string
}

export default function MotionReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = animationVariants[animation]

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={variants}
      transition={{ ...smoothTransition, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  )
}
