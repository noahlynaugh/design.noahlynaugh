import {initLenis,destroyLenis} from "./lenis.js";
import {enterProjectAnimation,leaveHomeAnimation, leaveProjectAnimation,enterHomeAnimation} from "./animations/index.js";
// import {checkImageBrightness} from "../Components/galleryCard.js";
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(Flip);

    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    barba.init({
        views: [
            {
              namespace: "home",
              beforeEnter(data) {
                initLenis(data.next.container); // Initialize Lenis when entering "home"
                data.next.container.querySelectorAll("gallery-card").forEach(card => {
                  const img = card.imageSlot.assignedNodes()[0];
                  if (img){
                    card.checkImageBrightness(img);
                  }
                })
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
            sessionStorage.setItem ("scrollY", data.current.container.scrollTop);
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
        afterEnter(data) {
            // let scrollY = sessionStorage.getItem("scrollY");
            // gsap.to(data.next.container,{
            //   scrollTo: scrollY
            // })
            return enterHomeAnimation(data);
            },
        }]}
    );
});