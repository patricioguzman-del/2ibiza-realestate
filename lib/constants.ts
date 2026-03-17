// ─── Contact details ─────────────────────────────────────────────────────────
// Single source of truth — used in Navbar, Footer, ValuationCTA, property pages.

export const CONTACT = {
  phone:        '+34 971 000 000',
  phoneHref:    'tel:+34971000000',
  email:        'hello@2ibiza.com',
  emailHref:    'mailto:hello@2ibiza.com',
  whatsappHref: 'https://wa.me/34600000000',
  address:      'Carrer de sa Creu, 12\n07800 Ibiza, Spain',
} as const

// ─── Property search options ──────────────────────────────────────────────────
// Shared between Hero search card and PropertiesClient filter bar.

export const BUDGET_OPTIONS = [
  { value: '1000000',  label: 'Under €1M'   },
  { value: '2000000',  label: 'Under €2M'   },
  { value: '5000000',  label: 'Under €5M'   },
  { value: '10000000', label: '€5M+'        },
] as const

export const BED_OPTIONS = [1, 2, 3, 4, 5, 6] as const

// ─── Property domain labels ───────────────────────────────────────────────────

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  villa:     'Villa',
  finca:     'Finca',
  apartment: 'Apartment',
  penthouse: 'Penthouse',
  plot:      'Plot',
  townhouse: 'Townhouse',
}

// ─── Blog category labels ─────────────────────────────────────────────────────

export const BLOG_CATEGORY_LABELS: Record<string, string> = {
  'market-report': 'Market Report',
  'guide':         'Guide',
  'news':          'News',
  'lifestyle':     'Lifestyle',
}

// ─── Image placeholder ────────────────────────────────────────────────────────
// Warm stone/deep forest SVG blur — used as blurDataURL across all image components.

export const BLUR_DARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3Crect fill='%232F3A37' width='4' height='3'/%3E%3C/svg%3E"
