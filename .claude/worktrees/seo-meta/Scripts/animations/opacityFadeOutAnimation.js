import {gsap} from "gsap"

const opacityFadeOutAnimation = (data) => {
    const tl = gsap.timeline({

    });
    
    tl.to(data,{
        autoAlpha: 0,
        duration: .6,
        ease: 'power4.out'
    })

    return tl
}

export default opacityFadeOutAnimation;