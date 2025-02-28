function updateYear() {
    const footerTextElement = document.querySelectorAll("#footer-year-text-id");
    const currentYear = new Date().getFullYear().toString();
    // Loop through all the selected footer elements and update their textContent
    footerTextElement.forEach((TextElement) => {
        TextElement.textContent = TextElement.textContent.replace("*Year*", currentYear);
        console.log("Year updated to", currentYear);
    });
}

// Run the updateYear function on initial load
document.addEventListener('DOMContentLoaded', updateYear);

// Hook into Barba.js transitions
barba.hooks.beforeEnter(() => {
    updateYear();
});