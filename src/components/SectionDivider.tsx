interface SectionDividerProps {
  type?: 'wave' | 'angle' | 'curve'
  from?: string
  to?: string
  flip?: boolean
}

export default function SectionDivider({
  type = 'wave',
  from = '#FFFFFF',
  to = '#F8F5F0',
  flip = false,
}: SectionDividerProps) {
  const transform = flip ? 'scaleY(-1)' : undefined

  if (type === 'wave') {
    return (
      <div className="relative -mt-px -mb-px" style={{ transform }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <rect width="1440" height="80" fill={from} />
          <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill={to} />
        </svg>
      </div>
    )
  }

  if (type === 'angle') {
    return (
      <div className="relative -mt-px -mb-px" style={{ transform }}>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <rect width="1440" height="60" fill={from} />
          <polygon points="0,40 1440,0 1440,60 0,60" fill={to} />
        </svg>
      </div>
    )
  }

  // curve
  return (
    <div className="relative -mt-px -mb-px" style={{ transform }}>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
        <rect width="1440" height="60" fill={from} />
        <path d="M0 60C360 0 1080 0 1440 60H0Z" fill={to} />
      </svg>
    </div>
  )
}
