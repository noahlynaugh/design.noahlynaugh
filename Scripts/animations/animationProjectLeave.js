// animation to leave the project page to the home page

const leaveProjectAnimation = (container) => {
    console.log(container);
    const excludeElem = document.querySelector('project-lander');
    const tl = gsap.timeline({
        defaults:{
            ease: 'power4.out',
            duration: .6
        }
    });
    const elementsToFade = Array.from(container.children).filter(element => element !== excludeElem);
    
    tl.to(container,{
        scrollTo:0,
    })
    tl.to(elementsToFade,{
        autoAlpha:0,
    })
    return tl
}

export default leaveProjectAnimation;