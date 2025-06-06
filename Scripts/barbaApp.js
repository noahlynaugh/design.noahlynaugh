import {initLenis} from "./lenis.js";
import {enterProjectAnimation,leaveHomeAnimation, leaveProjectAnimation,enterHomeAnimation,aboutEnterAnimation,opacityFadeOutAnimation,opacityFadeInAnimation} from "./animations/index.js";
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(Flip);
    gsap.registerPlugin(SplitText)

    initLenis(document.querySelector('[data-barba="container"]'));

    barba.hooks.before(() => {
      document.body.classList.add('scroll-lock');
    });

    barba.hooks.after(() => {
      document.body.classList.remove('scroll-lock');
    });

    barba.init({
        preventRunning: true,
        views: [
            {
              namespace: "home",
              beforeEnter(data) {
                let scrollTop = sessionStorage.getItem("scrollTop") || 0;
                gsap.set(data.next.container,{
                  scrollTop: scrollTop
                })
                const video = document.querySelector('video');
                if (video.paused) {
                  video.play().catch(err => {
                    console.warn('Autoplay failed:', err);
                  });
                }
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
        leave: (data) => {
            return leaveHomeAnimation(data);
        },
        enter: (data) => {
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
        leave:(data) => {
            return leaveProjectAnimation(data);
        },
        enter:(data) => {
            return enterHomeAnimation(data);

            },
        },
        {
        name: 'to-about-transition',
        to: {
          namespace: ["about"]
        },
        leave: ({current}) => {
         return opacityFadeOutAnimation(current.container)
        },
        enter: ({next}) => {
          return aboutEnterAnimation(next.container,false);
        }
      },
      {
        name: 'from-about-transition',
        from: {
          namespace: ["about"]
        },
        leave: ({current}) => {
          console.log("fade out")
          return aboutEnterAnimation(current.container,true)
        },
        enter: ({next}) =>{
          console.log("fade in")
          return opacityFadeInAnimation(next.container)
        }
      }
    ]})
});