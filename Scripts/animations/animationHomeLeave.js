// animtion to leave the gallery page and go to the project page

function findContent(data){
    let content = data.trigger.trigger.querySelector("#media")
    if (content.tagName === "VIDEO") {
        // If a video was clicked
        const clickedCardVideo = data.trigger.trigger.querySelector("#media");
        return clickedCardVideo;
    }
    else if (content.tagName === 'IMG'){
        // If an image was clicked
        const clickedCardImage = data.trigger.trigger.querySelector("#media");
        return clickedCardImage;
    }
}

const leaveHomeAnimation = (data) => {
    //Find the content that links to the project interacted with
    // Fade all elements but content
    const galleryCardContainer = (data.trigger);
    const elementsToFade = [galleryCardContainer.trigger.buttonLink,galleryCardContainer.trigger.galleryText];
    const link = galleryCardContainer.trigger.link;
    var moreElementsToFade = Array.from(data.current.container.querySelector("#Gallery-Container").children);
    moreElementsToFade = moreElementsToFade.filter(element => (element.link != link));
    const tl = gsap.timeline({
        defaults:{
            ease: 'power3.out',
            duration: .3
        }
    });
    // Add fade-out animation for selected elements
    tl.to(elementsToFade, {
        autoAlpha: 0,
        onComplete: () =>{
            const content = findContent(data);
            if (content) {
                const projectId = content.dataset.src|| content.src || content.currentSrc; // Use your specific identifier
                sessionStorage.setItem("activeProjectId", projectId);
            }
        }
    });
    tl.to(moreElementsToFade, {
        autoAlpha:0,
        ease: "power2.in",
    }, "-=.05")
    
    
    
    //return the timeline animation 
    return tl;
}

export default leaveHomeAnimation;