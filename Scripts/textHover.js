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

    // Add event listeners for interactions
    element.addEventListener('pointerenter', (e) => {
        console.log("pointerEnter",e); 
        hoverAnimation.play()
    });
    element.addEventListener('pointerleave', (e) => {
        console.log("pointerLeave",e);
        hoverAnimation.reverse()
    });
    element.addEventListener('pointerdown', (e) => {
        console.log("pointerDown",e);
        hoverAnimation.play()}
    );
    element.addEventListener('pointerup', (e) => {
        console.log("pointerUp",e);
        hoverAnimation.reverse()
    });
    element.addEventListener('pointercancel', (e) => {
        console.log("cancel",e);
        hoverAnimation.reverse()
    });
}


