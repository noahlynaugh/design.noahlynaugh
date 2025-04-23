import {initLenis,destroyLenis, startLenis,stopLenis} from "./lenis.js";
import {enterProjectAnimation,leaveHomeAnimation, leaveProjectAnimation,enterHomeAnimation} from "./animations/index.js";
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(Flip);

    barba.hooks.after((data) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log('nextContainer scrollHeight:', document.querySelector('[data-barba="container"]').scrollHeight);
            console.log('nextContainer',data.next.container)
            initLenis(data.next.container)
            startLenis();
          }, 1000);
        });
      });
    });

    barba.hooks.before(() => {
      stopLenis();
    })

    barba.init({
        views: [
            {
              namespace: "home",
              beforeEnter(data) {
                let scrollTop = sessionStorage.getItem("scrollY") || 0;
                gsap.set(data.next.container,{
                  scrollTop: scrollTop
                })
              },
              beforeLeave(data){
                sessionStorage.setItem ("scrollTop", data.current.container.scrollTop);
              },
            },
          ],
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