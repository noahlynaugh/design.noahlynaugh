import { createClient } from '@sanity/client'
import { createImageElement } from './sanityImageUrl.js'
import gsap from 'gsap'

const client = createClient({
  projectId: 'wiymqwkz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export class MoodBoard extends HTMLElement {
  async connectedCallback() {
    const title = this.getAttribute('mood-title')
    const speed = parseFloat(this.getAttribute('speed') || '30')

    const query = title
      ? `coalesce(*[_type == "moodboard" && title == $title][0], *[_type == "moodboard"][0]){ title, images[]{ ..., asset-> } }`
      : `*[_type == "moodboard"][0]{ title, images[]{ ..., asset-> } }`

    let moodboard
    try {
      moodboard = await client.fetch(query, title ? { title } : {})
    } catch (err) {
      console.error('[mood-board] Sanity fetch failed:', err)
      return
    }

    if (!moodboard || !moodboard.images) return

    // Host element styles
    Object.assign(this.style, {
      display: 'block',
      overflow: 'hidden',
      width: '100%',
    })

    // Scrolling track — two identical sets side by side for seamless loop
    const track = document.createElement('div')
    Object.assign(track.style, {
      display: 'flex',
      willChange: 'transform',
    })

    const buildSet = () => {
      const set = document.createElement('div')
      Object.assign(set.style, {
        display: 'flex',
        gap: '16px',
        paddingRight: '16px',
        flexShrink: '0',
      })
      moodboard.images.forEach(image => {
        const img = createImageElement(image, {
          alt: image.name || '',
          loading: 'lazy',
        })
        Object.assign(img.style, {
          height: '300px',
          width: 'auto',
          objectFit: 'cover',
          flexShrink: '0',
          display: 'block',
        })
        set.appendChild(img)
      })
      return set
    }

    const set1 = buildSet()
    const set2 = buildSet()
    track.appendChild(set1)
    track.appendChild(set2)
    this.appendChild(track)

    // Wait for images to load before measuring
    const allImages = [...track.querySelectorAll('img')]
    await Promise.allSettled(allImages.map(img => {
      if (img.complete) return Promise.resolve()
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    }))

    // Animate track by the width of one set — seamlessly loops back to start
    gsap.to(track, {
      x: -set1.offsetWidth,
      duration: speed,
      ease: 'none',
      repeat: -1,
    })
  }
}

customElements.define('mood-board', MoodBoard)
