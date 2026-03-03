//moodboard componenent
//will take data from sanity
// I want the images to either move into each other from “random” spots in a collage way… or away from each other…

// sanityImageUrl.ts
import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url'

import { client } from './client' // see example client config

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true
})

// Create an image URL builder using the client
const builder = createImageUrlBuilder(client)

// Export a function that can be used to get image URLs
urlFor(SanityImageSource); {
  return builder.image(source)
}

export class moodBoard extends HTMLElement {
    constructor() {
        super()
        this._images = []
    }
}

customElements.define('mood-board', moodBoard)