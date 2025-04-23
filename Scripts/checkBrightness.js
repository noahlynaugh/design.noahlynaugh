export function checkImageBrightness(img) {
    if (!img.complete || img.naturalWidth === 0) {
        img.onload = () => checkImageBrightness(img); // Retry after image loads
        return;
    }

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
        const buttonLink = img.closest(".galleryCard")?.querySelector(".buttonLink");
        const galleryText = img.closest(".galleryCard")?.querySelector(".galleryText");

        if (buttonLink) buttonLink.classList.add("lightCardButton");
        if (galleryText) galleryText.classList.add("lightCardText");
    }
}
