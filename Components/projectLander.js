//Author: Noah Lynaugh
//This file is the the **projectLander** component
//It only needs to run, not be imported by main.js

import { fetchProjectMedia, buildMediaElement } from './sanityMedia.js'

export class projectLander extends HTMLElement {
    constructor() {
        super();

        //take out shadow root and mimic gal. card
        this.slug = this.getAttribute('project');
        // Hardcoded #media (if present) is the synchronous fallback that the
        // Flip transition animates; Sanity media replaces it when available.
        this.media = this.querySelector("#media");
    }

    async connectedCallback() {
        if (!this.slug) return; // no slug -> keep the hardcoded fallback
        const data = await fetchProjectMedia(this.slug);
        if (!data || !data.media) return; // Sanity empty -> keep the fallback

        const holder = this.querySelector('.landerContainer') || this;
        // Preserve the lander's flip id + zoom hook so the shared-element zoom
        // and the full-screen zoom viewer keep working on the new element.
        const flipId = this.media ? this.media.getAttribute('data-flip-id') : null;
        const el = buildMediaElement(data.media, {
            className: 'landerMedia',
            dataZoom: true,
            flipId: flipId || undefined,
        });
        if (!el) return;

        if (this.media) this.media.replaceWith(el);
        else holder.appendChild(el);
        this.media = el;
    }
}

// gallery-card component as a custom HTML element
customElements.define('project-lander', projectLander);
