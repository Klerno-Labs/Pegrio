export default function SocialProofBar() {
  const stats = [
    '50+ Websites Built',
    '90+ PageSpeed Score',
    '3-Week Average Delivery',
    'Houston & Nationwide',
  ]

  return (
    <section className="bg-gray-bg py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={stat} className="flex items-center gap-8">
              <span className="text-gray-text font-semibold">{stat}</span>
              {index < stats.length - 1 && (
                <div className="hidden md:block h-8 w-px bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
