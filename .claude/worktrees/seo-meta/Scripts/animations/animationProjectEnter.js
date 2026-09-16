// animation to enter the project page from the gallery page
import {gsap,Flip} from 'gsap/all';
gsap.registerPlugin(Flip);
import {swap} from '../swap.js';

const enterProjectAnimation = (data) => {
    const landerMedia = document.querySelector("project-lander");
    const galleryCard = data.trigger.trigger
    const elementsToFade = Array.from(data.next.container.children).filter(element => element !== landerMedia);
    gsap.set([elementsToFade,galleryCard],{
        autoAlpha:0,
    });
    const tl = gsap.timeline({
        defaults:{
            ease: 'power4.out',
            duration: .2
        }
    });

    let media = [galleryCard,landerMedia]

    const state = Flip.getState(media);

    swap(media);

     if (landerMedia.media instanceof HTMLVideoElement){
            landerMedia.media.play()
        }
        
    tl.add(Flip.from(state, {
        absolute: true,
        nested: true,
        duration: .6,
        ease: 'power4.out',
    }));
    tl.to(elementsToFade,{
        autoAlpha:1,
        duration:.3,
        ease: 'power4.out',
    })
    tl.totalDuration(.6)

    return tl

}

export default enterProjectAnimation;