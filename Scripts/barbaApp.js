import {initLenis} from "./lenis.js";
import {nav_scroll} from "./nav_scroll.js";
import  {updateYear} from "./year_update.js"
//potentially can import all functions from modules????
import {opacityFadeOutAnimation,opacityFadeInAnimation,aboutEnterAnimation,enterHomeAnimation,leaveProjectAnimation,enterProjectAnimation,leaveHomeAnimation} from "./animations/index.js";
//And animations???

import barba from '@barba/core';
export default barba

import {gsap} from 'gsap'
document.addEventListener('DOMContentLoaded', () => {
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
      once: ({next}) => {
          updateYear()
          nav_scroll()
          return opacityFadeInAnimation(next.container);
      }
      },
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
        return opacityFadeOutAnimation(current.container,true)
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
        return aboutEnterAnimation(current.container,true)
      },
      enter: ({next}) =>{
        return opacityFadeInAnimation(next.container)
      }
    }],
  })

  barba.hooks.beforeEnter(() => {
    updateYear();
  })

  barba.hooks.before(() => {
    document.body.classList.add('scroll-lock');
    });

  barba.hooks.after(() => {
    initLenis(document.querySelector('[data-barba="container"]'));
    nav_scroll();
    document.body.classList.remove('scroll-lock');
  });
})
