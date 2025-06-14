import barba from '@barba/core';
import brightnessValues from '../public/brightness-metadata.json'

export class galleryCard extends HTMLElement {
    constructor() {
        super();

        this.buttonLink = this.querySelector('.buttonLink');
        this.galleryText = this.querySelector(".galleryText");
        this.link = this.getAttribute("href");
        this.media = this.querySelector('#media');
        this.applyBrightnessMode();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addEventListener("click", (event) => {
            event.preventDefault();
            barba.go(this.link, { trigger: this });
        });
    }

    applyBrightnessMode() {
        if (!this.media) return;

        // Extract filename from media src
        const src = this.media.getAttribute('src') || '';
        const filename = src.split('/').pop();

        const data = brightnessValues[filename];
        if (!data) {
            console.warn(`No brightness data found for ${filename}`);
            return;
        }

        const isLight = data.lightMode;

        // Apply classes conditionally
        if (isLight) {
            return
        } else {
            this.buttonLink.classList.add('lightCardButton');
            this.galleryText.classList.add('lightCardText');
        }
    }
}


customElements.define("gallery-card", galleryCard)