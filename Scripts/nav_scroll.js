function nav_scroll() {
    const main = document.querySelector('main');
    const logo = document.querySelector('.logo');
    const navButtons = document.querySelector("#navbar").navButtons;

    // Track scroll position
    let lastScrollTop = 0;
    let skipAnimations = false;

    main.addEventListener('scroll', () => {
        if (skipAnimations) return;

        const currentScrollTop = main.scrollTop;
        console.log("currentScrollTop",currentScrollTop,"LastScrollTop",lastScrollTop)

        if ((currentScrollTop > lastScrollTop) ^ (currentScrollTop==0)) {
            // Scrolling down: Fade out navbar
            gsap.set(navButtons, { autoAlpha: 1});
        }
        else if(currentScrollTop > lastScrollTop){
            gsap.to(navButtons, { autoAlpha: 0, duration: 0.3 });
        }
        // else if((currentScrollTop < lastScrollTop)) {
        //     // Scrolling up: Fade in navbar buttons
        //     gsap.to(navButtons, { autoAlpha: 1, duration: 0.3 });
        // }

        if (currentScrollTop <= 0) {
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


// Run the updateYear function on initial load
document.addEventListener('DOMContentLoaded', nav_scroll);

// Hook into Barba.js transitions
if (window.barba) {
    barba.hooks.after(() => {
        nav_scroll();
    });
}
