// animtion to leave the gallery page and go to the project page
import {gsap} from 'gsap'

const leaveHomeAnimation = (data) => {
    //Find the content that links to the project interacted with
    // Fade all elements but content
    const galleryCardContainer = (data.trigger);
    const elementsToFade = [galleryCardContainer.trigger.buttonLink,galleryCardContainer.trigger.galleryText];
    const link = galleryCardContainer.trigger.link;
    const footer = data.current.container.querySelector("#Footer");
    var moreElementsToFade = Array.from(data.current.container.querySelector("#Gallery-Container").children);
    moreElementsToFade = moreElementsToFade.filter(element => (element.link != link));
    const tl = gsap.timeline({
        defaults:{
            ease: 'power3.in',
            duration: .35
        }
    });
    // Add fade-out animation for selected elements
    tl.to(elementsToFade, {
        autoAlpha: 0,
        onComplete: () =>{
            const content = data.trigger.trigger.media;
            if (content) {
                const projectId = content.dataset.src|| content.src || content.currentSrc; // Use your specific identifier
                sessionStorage.setItem("activeProjectId", projectId);
            }
        }
    });
    tl.to([moreElementsToFade,footer], {
        autoAlpha:0,
    }, "-=.5")
    tl.totalDuration(.3)
    
    
    
    //return the timeline animation 
    return tl;
}

export default leaveHomeAnimation;