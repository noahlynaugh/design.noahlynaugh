//Author: Noah Lynaugh
//This file is the the **navbar** component
//It only needs to run, not be imported by main.js

// Takes a logo, link for the logo, and various links in the nav menu
const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    @import '/Styles/index.css';
    ::slotted(logo){
        text-decoration: none; /* Ensure no underline */
        color: var(--color--text); /* Or any color you prefer */
    }
</style>
    <nav class="navContainer">
            <div class="navLogoLink">
                <slot name="logoLink" class="logoLinkblock">
                    <slot name="logo" class="logo"> Logo </slot>
                </slot>
            </div>
            <div class="navMenuContainer" id="navContainer">
                <slot name="navMenuLink" class="navMenuLink" id="navLink"> Menu Link </slot>
            </div>
            <div class="hamburgerMenu" id="burgerMenu">
                    <div class="menuIconLineTop"></div>
                    <div class="menuIconLineMiddle"></div>
                    <div class="menuIconLineBottom"></div>
            </div>
    </nav>
`;

class NavBar extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        let clone = template.content.cloneNode(true);
        shadowRoot.append(clone);
        this.burger= shadowRoot.querySelector('.hamburgerMenu');
        this.navMenu = shadowRoot.querySelector('.navMenuContainer');
        this.navMenuLinks = shadowRoot.querySelectorAll('.navMenuLink');
        this.navMenuSlot = shadowRoot.querySelector('slot[name="navMenuLink"]');
        this.link = this.navMenuSlot.getAttribute("href");
        this.menuLineTop = shadowRoot.querySelector('.menuIconLineTop');
        this.menuLineMiddle = shadowRoot.querySelector('.menuIconLineMiddle');
        this.menuLineBottom = shadowRoot.querySelector('.menuIconLineBottom');
        this.navButtons = shadowRoot.querySelectorAll("#navContainer, #burgerMenu");
    }

    connectedCallback() {
        const mediaQuery = window.matchMedia("(max-width: 992px)");

        this.burger.addEventListener('click', () => {
            // Disable click events to prevent multiple triggers during animation
            this.burger.style.pointerEvents = 'none';
            this.navMenuSlot.style.pointerEvents = "auto"
            this.flipMenu();
            // Re-enable click events after the animation is complete
            setTimeout(() => {
                this.burger.style.pointerEvents = 'auto';
            }, 600); // Matches the animation duration
        });

        // Keep a reference to the handler so you can remove it
        const handleNavClick = (event) => {
            this.flipMenu();
            event.preventDefault();
            barba.go(this.link);
        };

        const updateNav = () =>{
            if (mediaQuery.matches){
                this.navMenuSlot.style.pointerEvents = "none"
                this.navMenuSlot.removeEventListener('click', handleNavClick); // clean up before adding
                this.navMenuSlot.addEventListener('click', handleNavClick);
            }
            else{
                this.navMenuSlot.style.pointerEvents = "auto"
                this.navMenuSlot.removeEventListener('click', handleNavClick);
            }
        }

        updateNav();
        mediaQuery.addEventListener("change", updateNav);
    }


    flipMenu() {
        // console.log(this.navMenuSlot.assignedNodes());
        const navMenuLinks = this.navMenuSlot.assignedNodes()
        // Toggle the hidden class to show/hide the nav menu
        const state = Flip.getState([this.navMenu], {props: "borderRadius"});
        // Toggle classes to handle menu open/close
        const isOpening = !this.navMenu.classList.contains('open'); 
        const tl = gsap.timeline();

        //media query
        let mm = gsap.matchMedia();
        mm.add("(min-width: 993px)", () => {
            gsap.to(navMenuLinks, {
                clearProps: "transform",
                opacity:1,
                duration:0
            })
        });
        mm.add("(max-width: 992px)", () => {
            gsap.to(navMenuLinks, {
                opacity:0,
                duration:0
            })
        });
        

        // Animate the links
        if (isOpening) {
            this.navMenu.classList.toggle('open');
            document.body.classList.add('scroll-lock');
            gsap.to(this.navMenuLinks,{
                opacity: 1
            });
            tl.add('burger')
            tl.to(this.menuLineTop, {
                y: 8,
                rotate: 45,
                duration: .5,
                ease: "power1.out",
            }, 'burger');
            tl.to(this.menuLineMiddle, {
                width: 0,
                duration: .3,
                ease: "power4.out",
            },  'burger');
            tl.to(this.menuLineBottom, {
                y: -8,
                rotate: -45,
                duration: .5,
                ease: "power2.out",
            }, 'burger');
            tl.add(Flip.from(state,{
                duration:.3,
                ease: "expoScale(0.5,7,power1.in)",
                borderRadius: 0,
            }, 'burger'));
            tl.fromTo(
                navMenuLinks,
                { x: 500, opacity: 0 }, // Starting position and opacity
                {
                    x: 0,
                    opacity: 1,
                    zIndex:4,
                    stagger: {
                        each: .1,
                        from: "start"
                    },
                    duration: .4,
                    ease: "power1.out",
                }, 
            );
        } else {
            tl.add('burger');
            tl.to(this.menuLineTop, {
                y: 0,
                rotate: 0,
                duration: 0.3,
                ease: "power4.out",
            }, 'burger');
            tl.to(this.menuLineMiddle, {
                width: 24,
                duration: .3,
                ease: "power1.out",
            }, 'burger');
            tl.to(this.menuLineBottom, {
                y: 0,
                rotate: 0,
                duration: 0.3,
                ease: "power4.out",
            }, 'burger');
            tl.fromTo(
                navMenuLinks,
                { x: 0, opacity: 1 },
                {
                    x: 500,
                    opacity: 0,
                    zIndex:-1,
                    stagger: {
                        each: .1,
                        from: "end"
                    },
                    duration: .3,
                    ease: "power1.in",
                } , "burger"
            );   
            document.body.classList.remove('scroll-lock');
            this.navMenuSlot.style.pointerEvents = "none"
            setTimeout(() => {
                this.navMenu.classList.toggle('open');
                tl.add(Flip.from(state,{
                    duration:.2,
                    ease: "expoScale(0.5,7,power1.in)",
                    borderRadius: 4,
                }));
            }, 400);
        }

    }

}


// nav-bar compoenet as a custom HTML element
customElements.define('nav-bar', NavBar);