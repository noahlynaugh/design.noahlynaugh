const aboutEnterAnimation = (data) => {
    let split = SplitText.create('#headline',{ type: "words, chars"});
    gsap.from(split.chars,{
        autoAlpha: 0,
        duration: 2,
        y: -75,
        x: -10,
        scale: 2,
        ease: 'elastic.out',
        stagger: 0.01,
    })
}

export default aboutEnterAnimation;