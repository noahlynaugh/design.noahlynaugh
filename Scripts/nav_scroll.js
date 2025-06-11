// import barba from './barbaApp.js'
import {gsap} from 'gsap'
import barba from './barbaApp'

export function nav_scroll() {
    const main = document.querySelector('main');
    const logo = document.querySelector('.logo');
    const navButtons = document.querySelector("#navbar").navButtons;

    // Track scroll position
    let lastScrollTop = 0;
    let skipAnimations = false;

    main.addEventListener('scroll', () => {
        if (skipAnimations) return;

        const currentScrollTop = main.scrollTop;

        if ((currentScrollTop < lastScrollTop) ^ (currentScrollTop==0) ^ (lastScrollTop<0)) {
            // Scrolling down: Fade out navbar
            gsap.set(navButtons, { autoAlpha: 1});
        }
        else if((currentScrollTop > lastScrollTop) & (lastScrollTop>0)) {
            gsap.to(navButtons, { autoAlpha: 0, duration: 0.3 });
        }

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

