import {initLenis,destroyLenis, startLenis,stopLenis} from "./lenis.js";
import {enterProjectAnimation,leaveHomeAnimation, leaveProjectAnimation,enterHomeAnimation} from "./animations/index.js";
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(Flip);

    initLenis(document.querySelector('[data-barba="container"]'));

    barba.hooks.after((data) => {
      //doesnt keep track of video frame between transitions. I guess the real issue is that
      //it pauses to begin with
      data.next.container.querySelectorAll('video').forEach((video) => {
        video.play();
      })
      //
      //
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            initLenis(data.next.container);
            data.next.container.classList.remove('scroll-lock')
            data.current.container.classList.remove('scroll-lock');
          }, 300);
        });
      });
    });

    barba.hooks.before((data) => {
      data.current.container.classList.add('scroll-lock')
      data.next.container.classList.add('scroll-lock');
      })

    barba.init({
        views: [
            {
              namespace: "home",
              beforeEnter(data) {
                let scrollTop = sessionStorage.getItem("scrollTop") || 0;
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