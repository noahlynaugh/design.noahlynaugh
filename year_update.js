document.addEventListener('DOMContentLoaded', function() {

    const footerTextElement = document.querySelector("#footer-year-text-id");
    const currentYear = new Date().getFullYear().toString();
     // Replace the "*Year*" placeholder with the current year
     footerTextElement.textContent = footerTextElement.textContent.replace("*Year*", currentYear);
    console.log("Year updated to", currentYear);
})