//Author: Noah Lynaugh
//This file is the the **galleryCard** component
//It only needs to run, not be imported by main.js

// Takes a logo, link for the logo, and various links in the nav menu
const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    @import '/Styles/index.css';
</style>
    <section class="galleryCardSection">
            <div class="galleryCardContainer">
                <div class="buttonLink hover">
                    <svg width="20.0192" height="16">
                        <use href="/Assets/SVG/Arrow Graphic.svg#uuid-734dd229-9c06-4076-83cc-49fa06ff17e0"></use>
                    </svg>
                </div>
                <div class="galleryCardMedia">
                    <slot name="galleryCardMedia" class="hover"></slot>
                </div>
                <div class="galleryText">
                    <slot name="Title">This is a title</slot>
                    <slot name="Subtitle">This is a subtitile</slot>
                </div>
            </div>
    </section>
`;

class galleryCard extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        let clone = template.content.cloneNode(true);
        shadowRoot.append(clone);
        this.classList.add("galleryCard");
        this.buttonLink = shadowRoot.querySelector('.buttonLink');
        this.galleryText= shadowRoot.querySelector(".galleryText");
    }


    connectedCallback() {
        const imageSlot = this.shadowRoot.querySelector('slot[name="galleryCardMedia"]');
        const link = this.getAttribute("href")
        console.log(link);
    
        imageSlot.addEventListener("slotchange", () => {
            const img = imageSlot.assignedElements()[0];
            if (img) {
                this.checkImageBrightness(img);
            }
        });

        this.addEventListener("click", () => {
            window.location = link
        });
    }

    checkImageBrightness(img) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
    
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
        let brightness = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            brightness += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3; // Average RGB
        }
    
        brightness /= imageData.length / 4;
        
        // If brightness is below a threshold, switch to light text
        if (brightness < 175) {
            this.buttonLink.classList.add("lightCardButton");
            this.galleryText.classList.add("lightCardText");
        }
    }

}
    // nav-bar compoenet as a custom HTML element
customElements.define('gallery-card', galleryCard);