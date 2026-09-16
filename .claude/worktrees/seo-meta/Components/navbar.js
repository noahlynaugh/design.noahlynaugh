//Author: Noah Lynaugh
//This file is the the **navbar** component

import {gsap,Flip} from "gsap/all";
gsap.registerPlugin(Flip)
import styles from '../Styles/index.css?inline'
// Takes a logo, link for the logo, and various links in the nav menu
const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
    ${styles};
    ::slotted(logo){
        text-decoration: none; /* Ensure no underline */
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
        this.navMenuLinks = shadowRoot.querySelectorAll('#navLink');
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

        // // Keep a reference to the handler so you can remove it
        const handleNavClick = async (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            // Prevent default Barba navigation
            e.preventDefault();
            // Now trigger Barba navigation manually
            window.barba.go(link.href);
        };

        const updateNav = () =>{
            if (mediaQuery.matches){
                this.navMenuSlot.style.pointerEvents = "none"
                this.navMenuSlot.removeEventListener('click'); 
                this.navMenuSlot.addEventListener('click', handleNavClick());
            }
            else{
                this.navMenuSlot.style.pointerEvents = "auto";
                this.navMenuSlot.removeEventListener('click',handleNavClick()); 
            }
        }

        updateNav();
        mediaQuery.addEventListener("change", updateNav);
    }


    flipMenu() {
    return new Promise((reslove) => {
            const navMenuLinks = this.navMenuSlot.assignedNodes()
            
            const state = Flip.getState([this.navMenu], {props: "borderRadius"});
            // Toggle the hidden class to show/hide the nav menu
            // Toggle classes to handle menu open/close
            const isOpening = !this.navMenu.classList.contains('open'); 

            //media query
            let mm = gsap.matchMedia();
            mm.add("(min-width: 993px)", () => {
                gsap.to(navMenuLinks, {
                    clearProps: "all",
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
                const openingMenu = gsap.timeline()
                this.navMenu.classList.toggle('open');
                document.body.classList.add('scroll-lock');
                openingMenu.to(this.navMenuLinks,{
                    opacity: 1
                });
                openingMenu.add('burger')
                openingMenu.to(this.menuLineMiddle, {
                    width: 0,
                    duration: .3,
                    ease: "power4.out",
                },  'burger');
                openingMenu.to(this.menuLineTop, {
                    y: 8,
                    rotate: 45,
                    duration: .5,
                    ease: "power1.out",
                }, 'burger');
                openingMenu.to(this.menuLineBottom, {
                    y: -8,
                    rotate: -45,
                    duration: .5,
                    ease: "power2.out",
                }, 'burger');
                openingMenu.add(Flip.from(state,{
                    duration:.3,
                    ease: "power3.inOut",
                    borderRadius: 0,
                }, 'burger'));
                openingMenu.fromTo(
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
                ) ;
            } else {
                const tl = gsap.timeline({onComplete: () => {
                    reslove();  
                }})
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
                    this.navMenu.classList.toggle('open');
                tl.add(Flip.from(state,{
                    duration:.3,
                    ease: "power4.inOut",
                    simple:true,
                    absolute:true,
                }));
            }

        })
    }
}


// nav-bar compoenet as a custom HTML element
customElements.define('nav-bar', NavBar);