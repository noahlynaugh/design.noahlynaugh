const aboutLeaveAnimation = (data) => {
    gsap.to(data.current.container,{
        autoAlpha: 0,
        duration: 3,
        ease: 'power4.out'
    })
}

export default aboutLeaveAnimation;