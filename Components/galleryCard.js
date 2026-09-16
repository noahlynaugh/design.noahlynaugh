import barba from '@barba/core';
import brightnessValues from '../public/brightness-metadata.json'
import { fetchProjectMedia, buildMediaElement } from './sanityMedia.js'

export class galleryCard extends HTMLElement {
    constructor() {
        super();

        this.buttonLink = this.querySelector('.buttonLink');
        this.galleryText = this.querySelector(".galleryText");
        this.link = this.getAttribute("href");
        this.slug = this.getAttribute("project");
        // Hardcoded #media (if present in the light DOM) is the synchronous
        // fallback / placeholder — Sanity media replaces it when available.
        this.media = this.querySelector('#media');
        this.setupEventListeners();
    }

    // Attributes are reliable here (not in the constructor for parser-created
    // elements), and async work is allowed.
    async connectedCallback() {
        await this.loadSanityMedia();
        this.applyBrightnessMode();
    }

    async loadSanityMedia() {
        if (!this.slug) return; // no slug -> keep the hardcoded fallback
        const data = await fetchProjectMedia(this.slug);
        if (!data || !data.media) return; // Sanity empty -> keep the fallback
        const holder = this.querySelector('.galleryCardMedia');
        if (!holder) return;

        const el = buildMediaElement(data.media, { className: 'cardMedia' });
        if (!el) return;

        if (this.media) this.media.replaceWith(el);
        else holder.appendChild(el);
        this.media = el;
        this._sanityBrightness = data.media.brightness;
    }

    setupEventListeners() {
        this.addEventListener("click", (event) => {
            event.preventDefault();
            barba.go(this.link, { trigger: this });
        });
    }

    applyBrightnessMode() {
        if (!this.buttonLink || !this.galleryText) return;

        let isLight;
        if (typeof this._sanityBrightness === 'boolean') {
            // Prefer the brightness authored in Sanity.
            isLight = this._sanityBrightness;
        } else {
            // Fallback: look up by filename in brightness-metadata.json.
            if (!this.media) return;
            const src = this.media.getAttribute('src') || '';
            const filename = decodeURIComponent(src.split('/').pop() || '');
            const data = brightnessValues[filename];
            if (!data) {
                console.warn(`No brightness data found for ${filename}`);
                return;
            }
            isLight = data.lightMode;
        }

        // Light image -> dark caption (default, no extra classes).
        // Dark image -> light caption classes.
        if (isLight) return;
        this.buttonLink.classList.add('lightCardButton');
        this.galleryText.classList.add('lightCardText');
    }
}


customElements.define("gallery-card", galleryCard)
