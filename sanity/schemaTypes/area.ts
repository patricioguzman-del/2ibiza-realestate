import { defineField, defineType, defineArrayMember } from 'sanity'

export const areaSchema = defineType({
  name: 'area',
  title: 'Area',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'galleryImages', title: 'Gallery Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'summary', title: 'Summary (for cards)', type: 'text', rows: 2 }),
    defineField({
      name: 'neighborhoods',
      title: 'Neighbourhoods & Zones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
            defineField({ name: 'note', title: 'Short description', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'note' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'heroImage' },
  }
})
