document.querySelectorAll('.hover').forEach((element) => {
        setupHoverAnimation(element);
});

document.querySelectorAll("gallery-card").forEach(card => {
    const buttonLink = card.shadowRoot?.querySelector(".buttonLink"); // Access shadow DOM
    if (buttonLink?.classList.contains("hover")) {
        setupHoverAnimation(buttonLink);
    }
});

function setupHoverAnimation(element) {
    const weight = parseInt(window.getComputedStyle(element).fontWeight);
    const newWeight = Math.min(weight + 300,900);

    const hoverAnimation = gsap.to(element, {
        fontWeight: newWeight,
        scale: 1.1,
        duration: .161,
        paused: true,
        ease: "expoScale(0.5,7,power2.in)",
    });

    // Add event listeners for hover
    element.addEventListener('mouseenter', () => hoverAnimation.play());
    element.addEventListener('mouseleave', () => hoverAnimation.reverse());

    // Touch events for mobile
    element.addEventListener('touchstart', () => hoverAnimation.play(),{ passive: true });
    element.addEventListener('touchend', () => hoverAnimation.reverse(),{ passive: true });
}


