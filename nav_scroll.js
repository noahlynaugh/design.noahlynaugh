function nav_scroll() {
    const main = document.querySelector('main');
    const logo = document.querySelector('.rl_navbar1_logo_linkblock');
    const navButtons = document.querySelectorAll('.rl_navbar1_menu, .rl_navbar1_menu-button');

    // Track scroll position
    let lastScrollTop = 0;
    let skipAnimations = false;

    main.addEventListener('scroll', () => {
        if (skipAnimations) return;

        const currentScrollTop = main.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            // Scrolling down: Fade out navbar
            gsap.to(navButtons, { autoAlpha: 0, duration: 0.3 });
        } else {
            // Scrolling up: Fade in navbar buttons
            gsap.to(navButtons, { autoAlpha: 1, duration: 0.3 });
        }

        if (currentScrollTop === 0) {
            gsap.to(logo, { autoAlpha: 1, duration: 0.5 });
        } else {
            gsap.to(logo, { autoAlpha: 0, duration: 0.3 });
        }

        lastScrollTop = currentScrollTop;
    });


    // Set skipAnimations during transitions
    barba.hooks.before(() => {
        skipAnimations = true;
        if (sessionStorage.getItem("scrollPosition") > 200){
            gsap.to(logo, { autoAlpha: 0, duration: 0.2 });
            gsap.to(navButtons, { autoAlpha: 0, duration: 0.3 });
        } 
    });
    barba.hooks.after(() => {
        skipAnimations = false;
        if (sessionStorage.getItem("scrollPosition") < 200){
            gsap.to(logo, { autoAlpha: 1, duration: 0.2 });
            gsap.to(navButtons, { autoAlpha: 1, duration: 0.3 });
        } 
    });
}

function resetBurger(){
    const menuButton = document.querySelector('.rl_navbar1_menu-button');
    if (isTabletOrLower() && menuButton.classList.contains('w--open')) {
        // Reset burger menu state
        menuButton.click();
    }
}

function isTabletOrLower() {
    // Check for both the class and the media query
    const navMenu = document.querySelector('.rl_navbar1_menu');
    return navMenu.classList.contains('is-page-height-tablet') || window.matchMedia('(max-width: 991px)').matches;
}


// Run the updateYear function on initial load
document.addEventListener('DOMContentLoaded', nav_scroll);

// Hook into Barba.js transitions
if (window.barba) {
    barba.hooks.after(() => {
        resetBurger();
        nav_scroll();
    });
}
