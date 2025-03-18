import {initLenis,destroyLenis} from "./lenis.js";
import {enterProjectAnimation,leaveHomeAnimation, leaveProjectAnimation,enterHomeAnimation} from "./animations/index.js";
document.addEventListener("DOMContentLoaded", function () {
    // Register GSAP and Flip
    gsap.registerPlugin(Flip);

    barba.init({
        //should probably change this into a global hook 
        // to make sure that code is effcient and smooth scroll works on the whole site. 
        views: [
            {
              namespace: "home",
              beforeEnter(data) {
                initLenis(data.next.container); // Initialize Lenis when entering "home"
              },
              afterLeave() {
                destroyLenis(); // Ensure Lenis keeps updating
              },
            },
            {
              namespace: "project",
              beforeEnter(data) {
                initLenis(data.next.container); // Initialize Lsenis when entering "project"
              },
            },
          ],
        debug: true,
        transitions: [
        {
        name: 'home-to-project-transtion',
        from: {
            namespace: ["home"]
        },
        to: {
            namespace: ["project"]
        },
        leave(data) {
            const container = data.current.container;
            sessionStorage.setItem('scrollPosition', container.scrollTop);
            return leaveHomeAnimation(data);
        },
        enter(data) {
            return enterProjectAnimation(data);
            },
        },
        {
        name: 'project-to-home-transtion',
        from: {
            namespace: ["project"]
        },
        to: {
            namespace: ["home"]
        },
        leave(data) {
            return leaveProjectAnimation(data.current.container);
        },
        enter(data) {
            return enterHomeAnimation(data);
            },
        }]}
    );
});