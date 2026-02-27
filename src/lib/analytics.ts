// Safe GA4 event tracking utility
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, params)
  }
}

export const GA_EVENTS = {
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  ORDER_START: 'order_start',
  ORDER_TIER_SELECT: 'order_tier_select',
  POPUP_EMAIL_SUBMIT: 'popup_email_submit',
  CTA_CLICK: 'cta_click',
  DEMO_VIEW: 'demo_view',
  PORTFOLIO_MODAL_OPEN: 'portfolio_modal_open',
} as const
