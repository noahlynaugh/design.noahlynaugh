import barba from '@barba/core';

export class galleryCard extends HTMLElement{
    constructor() {
        super();

        this.buttonLink = this.querySelector('.buttonLink');
        this.galleryText= this.querySelector(".galleryText");
        this.link = this.getAttribute("href");
        this.media = this.querySelector('#media');
        // Wait until media is ready, then check brightness
        if (this.media.tagName.toLowerCase() === 'video') {
            this.media.addEventListener('loadeddata', () => {
                requestAnimationFrame(() => {
                    this.analyzeBrightness();
                });
            });
        } else {
            this.media.addEventListener('load', () => {
                this.analyzeBrightness();
            });
        }

        this.setupEventListeners(); 
    }

    setupEventListeners() {
        this.addEventListener("click", (event) => {
            event.preventDefault();
            barba.go(this.link, { trigger: this});
        });
    }

    analyzeBrightness() {
    this.checkMediaBrightness(this.media).then(brightness => {
        if (brightness < 195) {
            this.buttonLink?.classList.add("lightCardButton");
            this.galleryText?.classList.add("lightCardText");
        }
    }).catch(err => {
        console.warn("Brightness check failed:", err);
    });
}


    checkMediaBrightness(mediaElement) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        return new Promise((resolve, reject) => {
            const isVideo = mediaElement.tagName.toLowerCase() === 'video';

            // Set dimensions based on media
            const width = mediaElement.videoWidth || mediaElement.naturalWidth;
            const height = mediaElement.videoHeight || mediaElement.naturalHeight;

            if (!width || !height) {
                reject("Media not ready");
                return;
            }

            canvas.width = width;
            canvas.height = height;

            const drawAndAnalyze = () => {
                try {
                    ctx.drawImage(mediaElement, 0, 0, width, height);
                    const imageData = ctx.getImageData(0, 0, width, height).data;

                    let brightness = 0;
                    for (let i = 0; i < imageData.length; i += 4) {
                        brightness += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
                    }
                    brightness /= imageData.length / 4;

                    resolve(brightness);
                } catch (err) {
                    reject(err);
                }
            };

            if (isVideo) {
                // Wait for video to be ready
                if (mediaElement.readyState >= 2) {
                    // Ensure it's at a frame
                    mediaElement.currentTime = 0.1;
                    mediaElement.addEventListener('seeked', drawAndAnalyze, { once: true });
                } else {
                    mediaElement.addEventListener('loadeddata', () => {
                        mediaElement.currentTime = 0.1;
                        mediaElement.addEventListener('seeked', drawAndAnalyze, { once: true });
                    }, { once: true });
                }
            } else {
                // For images
                if (mediaElement.complete) {
                    drawAndAnalyze();
                } else {
                    mediaElement.onload = drawAndAnalyze;
                }
            }
            });
    }
}


customElements.define("gallery-card",galleryCard)