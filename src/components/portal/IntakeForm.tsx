'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */

interface IntakeFormProps {
  tier: number
  initialData: Record<string, any>
  onSave: (answers: Record<string, any>) => Promise<void>
  onSubmit: (answers: Record<string, any>) => Promise<void>
  portalToken: string
}

interface Section {
  id: string
  title: string
  description: string
  minTier: number
  fields: Field[]
}

interface Field {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'radio' | 'checkbox-group'
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
  helpText?: string
}

/* ─── Section Definitions ─── */

const SECTIONS: Section[] = [
  {
    id: 'brand',
    title: 'Your Brand',
    description: 'Tell us about your brand identity and visual style.',
    minTier: 1,
    fields: [
      { name: 'business_name', label: 'Business Name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline / Slogan', type: 'text', placeholder: 'e.g., "Quality Service You Can Trust"' },
      {
        name: 'brand_personality', label: 'Brand Personality', type: 'select',
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'bold', label: 'Bold' },
          { value: 'elegant', label: 'Elegant' },
          { value: 'minimalist', label: 'Minimalist' },
          { value: 'playful', label: 'Playful' },
        ]
      },
      { name: 'primary_color', label: 'Primary Brand Color', type: 'color' },
      { name: 'secondary_color', label: 'Secondary Brand Color', type: 'color' },
      { name: 'accent_color', label: 'Accent Color', type: 'color' },
      {
        name: 'font_preference', label: 'Font Preference', type: 'select',
        options: [
          { value: 'modern-sans', label: 'Modern Sans' },
          { value: 'classic-serif', label: 'Classic Serif' },
          { value: 'clean-minimal', label: 'Clean & Minimal' },
          { value: 'bold-strong', label: 'Bold & Strong' },
        ]
      },
      { name: 'logo_url', label: 'Logo URL or Upload Instructions', type: 'text', placeholder: 'Link to your logo file or describe where to find it', helpText: 'Paste a link to your logo (Google Drive, Dropbox, etc.) or describe how to get it.' },
    ],
  },
  {
    id: 'content',
    title: 'Your Content',
    description: 'Share the content that will go on your website.',
    minTier: 1,
    fields: [
      { name: 'services', label: 'List Your Services', type: 'textarea', placeholder: 'One service per line\ne.g.,\nResidential Plumbing\nCommercial Plumbing\nEmergency Repairs', required: true },
      { name: 'about_business', label: 'About Your Business', type: 'textarea', placeholder: 'Your story, mission, and values...', required: true, helpText: 'This becomes the "About" section on your website.' },
      { name: 'years_in_business', label: 'Years in Business', type: 'number', placeholder: 'e.g., 15' },
      { name: 'service_area', label: 'Service Area / Location', type: 'text', placeholder: 'e.g., Dallas-Fort Worth Metro Area' },
      { name: 'team_members', label: 'Team Members', type: 'textarea', placeholder: 'One per line: Name - Title\ne.g., John Smith - Owner\nJane Doe - Lead Technician' },
      { name: 'testimonials', label: 'Customer Testimonials', type: 'textarea', placeholder: 'Include 3-5 testimonials with customer name\ne.g., "Great service!" - Mike R.', helpText: 'Real testimonials build trust with potential customers.' },
      { name: 'unique_selling_points', label: 'Unique Selling Points', type: 'textarea', placeholder: 'What makes you stand out from competitors?' },
    ],
  },
  {
    id: 'design',
    title: 'Design Preferences',
    description: 'Help us understand your visual taste.',
    minTier: 1,
    fields: [
      { name: 'reference_websites', label: 'Reference Websites You Like', type: 'textarea', placeholder: 'One URL per line\ne.g., https://example.com' },
      { name: 'reference_likes', label: 'What Do You Like About Them?', type: 'textarea', placeholder: 'e.g., "I like the clean layout and the way they showcase their services..."' },
      {
        name: 'style_preference', label: 'Style Preference', type: 'radio',
        options: [
          { value: 'modern-clean', label: 'Modern & Clean' },
          { value: 'classic-elegant', label: 'Classic & Elegant' },
          { value: 'bold-colorful', label: 'Bold & Colorful' },
          { value: 'minimalist', label: 'Minimalist' },
        ]
      },
      {
        name: 'photo_style', label: 'Photo Style', type: 'radio',
        options: [
          { value: 'real', label: 'Real photos' },
          { value: 'stock', label: 'Stock photos' },
          { value: 'ai-generated', label: 'AI-generated' },
          { value: 'mix', label: 'Mix of styles' },
        ]
      },
      { name: 'design_avoid', label: 'Any Design Elements to Avoid?', type: 'textarea', placeholder: 'e.g., "No neon colors, no overly flashy animations..."' },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Details',
    description: 'Technical information for setting up your website.',
    minTier: 1,
    fields: [
      { name: 'domain_name', label: 'Your Domain Name', type: 'text', placeholder: 'e.g., mybusiness.com' },
      { name: 'google_analytics_id', label: 'Existing Google Analytics ID', type: 'text', placeholder: 'e.g., G-XXXXXXXXXX (optional)', helpText: 'Leave blank if you don\'t have one.' },
      { name: 'social_media_links', label: 'Social Media Links', type: 'textarea', placeholder: 'One per line\ne.g., https://facebook.com/mybusiness\nhttps://instagram.com/mybusiness' },
      {
        name: 'preferred_contact_methods', label: 'Preferred Contact Method(s)', type: 'checkbox-group',
        options: [
          { value: 'phone', label: 'Phone' },
          { value: 'email', label: 'Email' },
          { value: 'contact-form', label: 'Contact Form' },
          { value: 'chat', label: 'Live Chat' },
        ]
      },
      { name: 'business_hours', label: 'Business Hours', type: 'text', placeholder: 'e.g., Mon-Fri 8am-6pm, Sat 9am-1pm' },
      { name: 'website_phone', label: 'Phone Number for Website', type: 'text', placeholder: '(555) 123-4567' },
      { name: 'website_email', label: 'Email for Website', type: 'text', placeholder: 'info@mybusiness.com' },
    ],
  },
  {
    id: 'goals',
    title: 'Goals',
    description: 'What do you want your website to achieve?',
    minTier: 1,
    fields: [
      {
        name: 'primary_cta', label: 'Primary Call-to-Action', type: 'select',
        options: [
          { value: 'book-now', label: 'Book Now' },
          { value: 'contact-us', label: 'Contact Us' },
          { value: 'get-a-quote', label: 'Get a Quote' },
          { value: 'shop-now', label: 'Shop Now' },
          { value: 'learn-more', label: 'Learn More' },
        ]
      },
      { name: 'target_audience', label: 'Target Audience Description', type: 'textarea', placeholder: 'Who are your ideal customers?', required: true },
      { name: 'top_competitors', label: 'Top 3 Competitors', type: 'textarea', placeholder: 'One per line with their website if known' },
      { name: 'what_makes_different', label: 'What Makes You Different?', type: 'textarea', placeholder: 'Your competitive advantage...' },
      { name: 'specific_features', label: 'Specific Features Needed', type: 'textarea', placeholder: 'e.g., Online booking, Gallery, Blog, FAQ section...' },
    ],
  },
  {
    id: 'content-media',
    title: 'Content & Media',
    description: 'Additional content options for your enhanced website.',
    minTier: 2,
    fields: [
      { name: 'blog_topics', label: 'Blog Topics / Categories', type: 'textarea', placeholder: 'e.g., Industry Tips, Company News, How-To Guides' },
      { name: 'gallery_description', label: 'Gallery / Portfolio Description', type: 'textarea', placeholder: 'Describe what you\'d like to showcase in your gallery' },
      {
        name: 'existing_content', label: 'Do You Have Existing Content to Reuse?', type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'some', label: 'Some' },
        ]
      },
      {
        name: 'booking_system', label: 'Booking System Preference', type: 'select',
        options: [
          { value: 'calendly', label: 'Calendly' },
          { value: 'custom-form', label: 'Custom Form' },
          { value: 'square', label: 'Square' },
          { value: 'none', label: 'None' },
        ]
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Advanced features for your premium website.',
    minTier: 3,
    fields: [
      { name: 'ecommerce_products', label: 'E-commerce Products Description', type: 'textarea', placeholder: 'Describe the products you\'d like to sell online' },
      {
        name: 'payment_processor', label: 'Payment Processor', type: 'select',
        options: [
          { value: 'stripe', label: 'Stripe' },
          { value: 'square', label: 'Square' },
          { value: 'paypal', label: 'PayPal' },
          { value: 'none', label: 'None' },
        ]
      },
      {
        name: 'user_authentication', label: 'User Authentication Needed?', type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      },
      { name: 'integrations', label: 'Integrations Needed', type: 'textarea', placeholder: 'e.g., CRM, Email marketing, Inventory system...' },
      { name: 'custom_features', label: 'Custom Features', type: 'textarea', placeholder: 'Describe any custom functionality you need' },
    ],
  },
]

/* ─── Component ─── */

export default function IntakeForm({ tier, initialData, onSave, onSubmit }: IntakeFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>(initialData || {})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Filter sections by tier
  const visibleSections = SECTIONS.filter((s) => tier >= s.minTier)
  const totalSections = visibleSections.length
  const section = visibleSections[currentSection]
  const isLastSection = currentSection === totalSections - 1

  // Compute completed sections count (sections where at least one field has data)
  const completedSections = visibleSections.filter((s) =>
    s.fields.some((f) => {
      const val = answers[f.name]
      if (Array.isArray(val)) return val.length > 0
      return val !== undefined && val !== '' && val !== null
    })
  ).length

  // Update a field value
  const updateField = useCallback((name: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Auto-save on section change
  const saveDraft = useCallback(async () => {
    setSaveStatus('saving')
    try {
      await onSave(answers)
      setSaveStatus('saved')
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
    }
  }, [answers, onSave])

  // Save when navigating sections
  const goToSection = useCallback(
    (index: number) => {
      saveDraft()
      setCurrentSection(index)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [saveDraft]
  )

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1)
    }
  }

  const handlePrev = () => {
    if (currentSection > 0) {
      goToSection(currentSection - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(answers)
    } catch {
      setIsSubmitting(false)
    }
  }

  // Pre-fill business name from order data
  useEffect(() => {
    if (initialData?.business_name && !answers.business_name) {
      setAnswers((prev) => ({ ...prev, business_name: initialData.business_name }))
    }
  }, [initialData])

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white/60">
            Section {currentSection + 1} of {totalSections}
          </span>
          <div className="flex items-center gap-2">
            {/* Save indicator */}
            <AnimatePresence mode="wait">
              {saveStatus === 'saving' && (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-white/40"
                >
                  Saving...
                </motion.span>
              )}
              {saveStatus === 'saved' && (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-green-400 flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </motion.span>
              )}
              {saveStatus === 'error' && (
                <motion.span
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400"
                >
                  Save failed
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-sm font-medium text-white/60">
              {completedSections}/{totalSections} complete
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-accent to-purple-400 rounded-full"
            initial={false}
            animate={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Section nav dots (desktop) */}
        <div className="hidden md:flex items-center gap-2 mt-4">
          {visibleSections.map((s, i) => {
            const hasData = s.fields.some((f) => {
              const val = answers[f.name]
              if (Array.isArray(val)) return val.length > 0
              return val !== undefined && val !== '' && val !== null
            })
            return (
              <button
                key={s.id}
                onClick={() => goToSection(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === currentSection
                    ? 'bg-purple-accent text-white'
                    : hasData
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {hasData && i !== currentSection && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {s.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white font-display">{section.title}</h2>
            <p className="text-white/50 mt-1">{section.description}</p>
          </div>

          <div className="space-y-6">
            {section.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={answers[field.name]}
                onChange={(val) => updateField(field.name, val)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
        <button
          onClick={handlePrev}
          disabled={currentSection === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {isLastSection ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-accent to-purple-500 hover:from-purple-600 hover:to-purple-accent text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-purple-accent/25"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Questionnaire
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-accent hover:bg-purple-600 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Field Renderer ─── */

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field
  value: any
  onChange: (val: any) => void
}) {
  const baseInputClasses =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-accent/50 focus:border-purple-accent/50 transition-all'

  switch (field.type) {
    case 'text':
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
          {field.helpText && (
            <p className="mt-1.5 text-xs text-white/40">{field.helpText}</p>
          )}
        </div>
      )

    case 'number':
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            min={0}
          />
        </div>
      )

    case 'textarea':
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseInputClasses} resize-none`}
          />
          {field.helpText && (
            <p className="mt-1.5 text-xs text-white/40">{field.helpText}</p>
          )}
        </div>
      )

    case 'color':
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {field.label}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value || '#6B3FA0'}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#6B3FA0"
              className={`${baseInputClasses} flex-1`}
            />
          </div>
        </div>
      )

    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClasses} appearance-none`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
          >
            <option value="" className="bg-[#1a1a2e] text-white">Select an option</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )

    case 'radio':
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {field.options?.map((opt) => {
              const isSelected = value === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                    isSelected
                      ? 'border-purple-accent bg-purple-accent/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-purple-accent' : 'border-white/30'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-purple-accent" />}
                    </div>
                    {opt.label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )

    case 'checkbox-group':
      const selectedValues: string[] = Array.isArray(value) ? value : []
      return (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            {field.label}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {field.options?.map((opt) => {
              const isChecked = selectedValues.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const next = isChecked
                      ? selectedValues.filter((v) => v !== opt.value)
                      : [...selectedValues, opt.value]
                    onChange(next)
                  }}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                    isChecked
                      ? 'border-purple-accent bg-purple-accent/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isChecked ? 'border-purple-accent bg-purple-accent' : 'border-white/30'
                    }`}>
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {opt.label}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )

    default:
      return null
  }
}
