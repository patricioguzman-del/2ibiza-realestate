export function formatPrice(price: number, priceOnRequest?: boolean): string {
  if (priceOnRequest) return 'Price on Request'
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatSqm(sqm: number): string {
  return `${sqm.toLocaleString()} m²`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
