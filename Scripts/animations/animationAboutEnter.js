const aboutEnterAnimation = (data) => {
    gsap.set(data.next.container.querySelector('#headline'),{
        autoAlpha: 0,
    })
    gsap.to(data.next.container.querySelector('#headline'),{
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power3.out'
    })
}

export default aboutEnterAnimation;