const opacityFadeInAnimation = (data) => {
    const tl = gsap.timeline({

    });
    
    tl.from(data,{
        autoAlpha: 0,
        duration: .6,
        ease: 'power4.in'
    })

    return tl
}

export default opacityFadeInAnimation;