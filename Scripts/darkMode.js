function applyColorMode() {
    const htmlElement = document.documentElement;
    const computed = getComputedStyle(htmlElement);
  
    const colorVars = "surface,text,outershadowtop,outershadowbottom,elevation";
  
    // Retrieve light and dark colors from CSS variables
    let lightColors = {};
    let darkColors = {};
    colorVars.split(",").forEach((item) => {
        const lightValue = computed.getPropertyValue(`--color--${item.trim()}`).trim();
        const darkValue = computed.getPropertyValue(`--color--dark--${item.trim()}`).trim();
        console.log(`Variable: ${item}, Light: ${lightValue}, Dark: ${darkValue}`);
        if (lightValue) {
            lightColors[`--color--${item.trim()}`] = lightValue;
            darkColors[`--color--${item.trim()}`] = darkValue || lightValue; // Default dark to light if undefined
        }
    });
  
    // Warn if no matching color variables are found
    if (!Object.keys(lightColors).length) {
        console.warn("No variables found matching the provided color variables.");
        return;
    }
  
    // Set the color mode based on user preference
    function setColors(colorObject) {
        if (typeof gsap !== "undefined") {
            gsap.to(htmlElement, {
              ...colorObject,
              duration: .6,
              ease: 'power3.out',
            });
          } else {
            Object.keys(colorObject).forEach((key) => {
              htmlElement.style.setProperty(key, colorObject[key]);
            });
          }
        }
  
    function applyDarkMode(isDark) {
        if (isDark) {
            htmlElement.classList.add("dark-mode");
            setColors(darkColors);
        } else {
            htmlElement.classList.remove("dark-mode");
            setColors(lightColors);
        }
    }
  
    // Check and apply the system's color preference
    function checkPreference(e) {
        applyDarkMode(e.matches);
    }
  
    const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
  
    // Set initial color mode based on system preference
    applyDarkMode(colorPreference.matches);
  
    // Update color mode when system preference changes
    colorPreference.addEventListener("change", checkPreference);
}
  
// Call the function to apply color mode on page load
document.addEventListener("DOMContentLoaded", applyColorMode);

// Hook into Barba.js transitions
if (window.barba) {
    barba.hooks.before(() => {
        applyColorMode();
    });
}