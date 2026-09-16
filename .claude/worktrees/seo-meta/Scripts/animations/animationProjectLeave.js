// animation to leave the project page to the home page
import {gsap} from 'gsap'

const leaveProjectAnimation = (data) => {
    const excludeElem = data.current.container.querySelector('project-lander');
    const tl = gsap.timeline({
        defaults:{
            ease: 'power4.out',
            duration: .3
        }
    });
    const elementsToFade = Array.from(data.current.container.children).filter(element => element !== excludeElem);
    
    tl.to(data.current.container,{
        scrollTop:0,
        duration: 1,
    })
    tl.to(elementsToFade,{
        autoAlpha:0,
        duration: 1,
        stagger: .1
    })
    tl.totalDuration(.6)
    return tl
}

export default leaveProjectAnimation;