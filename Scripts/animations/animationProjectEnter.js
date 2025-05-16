// animation to enter the project page from the gallery page

import {swap} from '../swap.js';

const enterProjectAnimation = (data) => {
    const landerMedia = document.querySelector("project-lander");
    const projectMedia = data.trigger.trigger
    const elementsToFade = Array.from(data.next.container.children).filter(element => element !== landerMedia);
    gsap.set(elementsToFade,{
        autoAlpha:0,
    });
    const tl = gsap.timeline({
        defaults:{
            ease: 'power4.out',
            duration: .2
        }
    });

    let media = [projectMedia,landerMedia]

    swap(media);

    const state = Flip.getState(media)

    tl.add(Flip.from(state, {
        absolute: true,
        nested: true,
        duration: .3,
        ease: 'power4.out',
        onComplete: () => {
            tl.to(landerMedia.media,{
                scale:1,
                duration:.3,
            })
        }
    }));
    tl.to(elementsToFade,{
        autoAlpha:1,
        duration:.3,
        ease: 'power4.out',
    });

}

export default enterProjectAnimation;