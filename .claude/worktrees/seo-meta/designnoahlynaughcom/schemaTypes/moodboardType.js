import {defineField, defineType} from 'sanity'
import ImageUrlPreview from './ImageUrlPreview.jsx'

// If you want to add Unsplash as an asset source, import it:
// import {unsplashAssetSource} from 'sanity-plugin-asset-source-unsplash'

export const moodBoardType = defineType({
  name: 'moodboard',
  title: 'Mood Board',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Upload Image',
          fields: [
            {
              name: 'name',
              title: 'Image Name',
              type: 'string',
            }
          ],

          preview: {
            select: {
              title: 'name',
              media: 'asset',
            },
            prepare({title, media}) {
              return {
                title: title || 'Uploaded Image',
                media,
              }
            }
          }
        },
        {
          type: 'object',
          name: 'imageUrlObject',
          title: 'Image URL',
          fields: [
            {
              name: 'url',
              title: 'Image URL',
              type: 'url',
              validation: Rule => Rule.uri({scheme: ['http', 'https']}),
            },
            {
              name: 'name',
              title: 'Image Name',
              type: 'string',
            }
          ],
          preview: {
            select: {
              url: 'url',
              name: 'name',
            },
            prepare({url, name}) {
              return {
                title: name || url || 'No name',
                media: url ? ImageUrlPreview({url, name}) : undefined,
              }
            }
          }
        }
      ]
    }
  ]
})