'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer } from '@/lib/motion'

interface MotionStaggerProps {
  children: ReactNode
  className?: string
}

export default function MotionStagger({ children, className = '' }: MotionStaggerProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  )
}
