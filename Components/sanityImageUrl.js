import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Configure this client for your project. Update projectId/dataset if needed.
const client = createClient({
  projectId: 'wiymqwkz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

/**
 * Create an <img> element from a Sanity image object, a plain URL string,
 * or a small object like { url: '...' }.
 * Options: { width, height, alt, className, loading }
 */
export function createImageElement(image, options = {}) {
  const { width, height, alt, className, loading = 'lazy' } = options

  let src = ''
  if (typeof image === 'string') {
    src = image
  } else if (image && image.asset) {
    // build a CDN URL with optional transforms
    let b = urlFor(image)
    if (width) b = b.width(width)
    if (height) b = b.height(height)
    src = b.url()
  } else if (image && image.url) {
    src = image.url
  }

  const img = document.createElement('img')
  img.src = src
  if (alt) img.alt = alt
  else if (image && image.alt) img.alt = image.alt
  if (className) img.className = className
  if (loading) img.loading = loading
  if (width) img.width = width
  if (height) img.height = height

  return img
}
