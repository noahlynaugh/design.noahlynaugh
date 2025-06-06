// animation to leave the project page to the home page

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
        scrollTo:0,
    })
    tl.to(elementsToFade,{
        autoAlpha:0,
    })
    return tl
}

export default leaveProjectAnimation;