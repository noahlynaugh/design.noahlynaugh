import {initLenis} from "./lenis.js";
import {enterProjectAnimation,leaveHomeAnimation, leaveProjectAnimation,enterHomeAnimation,aboutEnterAnimation,opacityFadeOutAnimation,opacityFadeInAnimation} from "./animations/index.js";
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(Flip);
    gsap.registerPlugin(SplitText)

    initLenis(document.querySelector('[data-barba="container"]'));

    barba.hooks.after((data) => {
      data.next.container.querySelectorAll('video').forEach((video) => {
        video.play();
      })
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