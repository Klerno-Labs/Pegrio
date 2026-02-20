'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How long does a website take?',
      answer: 'Most projects are live within 3 weeks from the kickoff call',
    },
    {
      question: 'What platform do you build on?',
      answer: 'Webflow for design-forward projects, WordPress for content-heavy sites that need more plugins',
    },
    {
      question: 'Do you work with businesses outside Houston?',
      answer: 'Yes — we work with clients across the entire US, fully remote, no difference in quality or process',
    },
    {
      question: 'What if I already have a website?',
      answer: 'We audit it free of charge and tell you honestly whether it needs a full rebuild or just targeted improvements',
    },
    {
      question: 'Do you offer ongoing maintenance?',
      answer: 'Yes — monthly maintenance and growth plans starting at $97/month',
    },
    {
      question: "What if I'm not happy with the result?",
      answer: "We keep revising until you are. That's the guarantee, and it's in writing.",
    },
  ]

  return (
    <section className="section bg-gray-bg">
      <div className="container max-w-3xl">
        <ScrollReveal>
          <h2 className="text-center mb-16">Common Questions</h2>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={index * 60}>
              <div className="card">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4"
                >
                  <h3 className="text-lg">{faq.question}</h3>
                  <span
                    className="text-2xl text-blue-accent flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openIndex === index ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </button>

                {openIndex === index && (
                  <p className="mt-4 text-gray-muted leading-relaxed">{faq.answer}</p>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
