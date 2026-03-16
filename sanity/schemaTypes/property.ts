import { defineField, defineType } from 'sanity'

export const propertySchema = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({
      name: 'status', title: 'Status', type: 'string',
      options: { list: ['available', 'under-offer', 'sold'], layout: 'radio' },
      initialValue: 'available'
    }),
    defineField({ name: 'exclusive', title: 'Exclusive Listing', type: 'boolean', initialValue: false }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'price', title: 'Price (€)', type: 'number' }),
    defineField({ name: 'priceOnRequest', title: 'Price on Request', type: 'boolean', initialValue: false }),
    defineField({
      name: 'area', title: 'Area', type: 'reference', to: [{ type: 'area' }]
    }),
    defineField({
      name: 'neighborhood',
      title: 'Neighbourhood / Zone',
      type: 'string',
      description: 'Specific zone within the area, e.g. "Cala Bassa" or "Sant Rafel"',
    }),
    defineField({
      name: 'propertyType', title: 'Property Type', type: 'string',
      options: { list: ['villa', 'finca', 'apartment', 'penthouse', 'plot', 'townhouse'] }
    }),
    defineField({ name: 'beds', title: 'Bedrooms', type: 'number' }),
    defineField({ name: 'baths', title: 'Bathrooms', type: 'number' }),
    defineField({ name: 'sqm', title: 'Built Area (m²)', type: 'number' }),
    defineField({ name: 'plotSqm', title: 'Plot Size (m²)', type: 'number' }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'hasTouristLicense', title: 'Has Tourist License', type: 'boolean', initialValue: false }),
    defineField({ name: 'offMarket', title: 'Off Market', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({
      name: 'coordinates', title: 'Coordinates', type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ]
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'images.0' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle?.toUpperCase(), media }
    }
  }
})
