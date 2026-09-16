// Author: Noah Lynaugh (scaffolded on branch claude/sanity-media)
// Shared Sanity hero-media helper for galleryCard + projectLander.
//
// The hero media for a project is authored ONCE in Sanity as a length-1
// `media` array (image OR video). Both the home galleryCard and the
// projectLander fetch the SAME asset by project slug, so the card -> lander
// GSAP Flip / Barba zoom carries a single continuous element.

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'wiymqwkz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// media[0] is the union item: {_type:'image'|'file', asset->, brightness}.
// asset->url resolves the CDN url for both images and files (video).
const PROJECT_MEDIA_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  "name": name,
  "media": media[0]{
    "type": _type,
    "url": asset->url,
    "mimeType": asset->mimeType,
    brightness
  }
}`

// Simple in-memory cache so repeated cards/landers for the same slug don't
// re-hit the network within a session.
const cache = new Map()

/**
 * Fetch a project's hero media by slug.
 * Returns { name, media: { type, url, mimeType, brightness } } or null.
 * Never throws — resolves to null on any failure so callers can fall back.
 */
export async function fetchProjectMedia(slug) {
  if (!slug) return null
  if (cache.has(slug)) return cache.get(slug)
  let result = null
  try {
    result = await client.fetch(PROJECT_MEDIA_QUERY, { slug })
  } catch (err) {
    console.warn(`[sanityMedia] fetch failed for slug "${slug}":`, err)
    return null
  }
  const value = result && result.media && result.media.url ? result : null
  cache.set(slug, value)
  return value
}

/** True when the resolved media should render as a <video>. */
export function isVideoMedia(media) {
  if (!media) return false
  if (media.type === 'file') return true
  return typeof media.mimeType === 'string' && media.mimeType.startsWith('video')
}

/**
 * Build an <img> or <video> element from a resolved media object.
 * Mirrors the hand-authored markup: id="media", the caller's media class,
 * autoplay/muted/loop for video. Returns null when media has no url.
 * Options: { className, dataZoom, flipId }
 */
export function buildMediaElement(media, options = {}) {
  const { className = 'cardMedia', dataZoom = false, flipId } = options
  if (!media || !media.url) return null

  let el
  if (isVideoMedia(media)) {
    el = document.createElement('video')
    el.setAttribute('playsinline', '')
    el.loop = true
    el.autoplay = true
    el.muted = true
    el.setAttribute('muted', '') // attribute form is required for autoplay in some browsers
    el.src = media.url
  } else {
    el = document.createElement('img')
    el.loading = 'lazy'
    el.src = media.url
  }

  el.id = 'media'
  if (className) el.classList.add(className)
  if (dataZoom) el.setAttribute('data-zoom', '')
  if (flipId) el.setAttribute('data-flip-id', flipId)
  return el
}
