import {initLenis} from "./lenis.js";
import {nav_scroll} from "./nav_scroll.js";
//potentially can import all functions from modules????
import * as animations from "./animations/index.js";
//And animations???

import barba from '@barba/core';
export default barba

import {gsap} from 'gsap'

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
     name: 'default',
     once: ({next}) => {
        nav_scroll()
        return animations.opacityFadeInAnimation(next.container);
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
        return animations.leaveHomeAnimation(data);
    },
    enter: (data) => {
        return animations.enterProjectAnimation(data);
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
        return animations.leaveProjectAnimation(data);
    },
    enter:(data) => {
        return animations.enterHomeAnimation(data);

        },
    },
    {
    name: 'to-about-transition',
    to: {
      namespace: ["about"]
    },
    leave: ({current}) => {
      return animations.opacityFadeOutAnimation(current.container,true)
    },
    enter: ({next}) => {
      return animations.aboutEnterAnimation(next.container,false);
    }
  },
  {
    name: 'from-about-transition',
    from: {
      namespace: ["about"]
    },
    leave: ({current}) => {
      console.log("fade out")
      return animations.aboutEnterAnimation(current.container,true)
    },
    enter: ({next}) =>{
      console.log("fade in")
      return animations.opacityFadeInAnimation(next.container)
    }
  }],
})

barba.hooks.before(() => {
  document.body.classList.add('scroll-lock');
  });

barba.hooks.after(() => {
  initLenis(document.querySelector('[data-barba="container"]'));
  nav_scroll();
  document.body.classList.remove('scroll-lock');
});