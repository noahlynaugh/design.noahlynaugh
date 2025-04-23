// Function to handle gallery card clicks
export function handleGalleryCardClick(event) {
    const card = event.target.closest(".galleryCard");
    if (card) {
        event.preventDefault();
        barba.go(card.getAttribute("href"), { trigger: card });
    }
}