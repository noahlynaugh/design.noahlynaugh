export class galleryCard extends HTMLElement{
    constructor() {
        super();

        this.buttonLink = this.querySelector('.buttonLink');
        this.galleryText= this.querySelector(".galleryText");
        this.link = this.getAttribute("href");
        this.media = this.querySelector('#media');

        this.setupEventListeners();
        this.checkImageBrightness(); // Check brightness on load
    }

    setupEventListeners() {
        this.addEventListener("click", (event) => {
            event.preventDefault();
            barba.go(this.link, { trigger: this});
        });
    }

    checkImageBrightness() {
        if (!this.media || !this.media.complete || this.media.naturalWidth === 0) {
            this.media.onload = () => this.checkImageBrightness();
            return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = this.media.naturalWidth;
        canvas.height = this.media.naturalHeight;

        ctx.drawImage(this.media, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let brightness = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            brightness += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
        }
        brightness /= imageData.length / 4;

        if (brightness < 175) {
            this.buttonLink?.classList.add("lightCardButton");
            this.galleryText?.classList.add("lightCardText");
        }
    }
}

customElements.define("gallery-card",galleryCard)