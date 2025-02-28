document.addEventListener("DOMContentLoaded", function () {
    // Register GSAP and Flip
    gsap.registerPlugin(Flip);

    const leaveAnimation = (data) => {
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
                    // console.log(projectId);
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

    const enterAnimation = (data) => {
        const landerMedia = document.querySelector('project-lander');
        const projectMedia = data.trigger.trigger

        const media = [projectMedia,landerMedia]

        const state = Flip.getState(media)

        swap(media);

        Flip.from(state, {
            absolute: true,
            nested: true,
            duration: .6,
            ease: 'power4.out',
        });
    
    }

    const leaveProjectAnimation = (container) => {
        console.log(container);
        const excludeElem = document.querySelector('#Project-Page-Lander');
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
            duration: .3
        })
        return tl
    }

    const enterHomeAnimation = (container) => {
        const tl = gsap.timeline({
            defaults:{
                ease: 'power4.out',
                duration: .3
            }
        });
        const scrollPos = sessionStorage.getItem('scrollPosition');
        const lander = document.querySelector('.lander');
        const matchingCard = findCard(container);
        const cardContainer = matchingCard.parentElement;
        const galleryContainer = cardContainer.parentElement;
        const elementsToFade = galleryContainer.querySelectorAll( ".button-link.w-inline-block, .w-layout-vflex.gallery_text");
        tl.to(elementsToFade,{
            autoAlpha:0,
            duration:0,
        });
        //Get state
        const state = Flip.getState(lander);
        // container.style.overflow = "Clip";
        lander.removeAttribute("style");
        // Add the new class
        lander.classList = (matchingCard.classList);
        matchingCard.replaceWith(lander);
        // gsap.set(elementsToFade, {autoAlpha:0});

        tl.to(container, {
            duration:0,
            scrollTo:scrollPos
        });
        tl.add(Flip.from(state, {
            zIndex: 12,
            absolute:true,
            nested:true,
            fade: true,
            onComplete: () =>{
                
            }
        }));
        tl.to(elementsToFade,{
            autoAlpha:1,
            ease: 'power3.out',
        });
        
        

        return tl
    }

    barba.init({
        transitions: [
        {
        debug:true,
        name: 'home-to-project-transtion',
        from: {
            namespace: ["home"]
        },
        to: {
            namespace: ["project"]
        },
        leave(data) {
            console.log("to-project");
            const container = data.current.container;
            sessionStorage.setItem('scrollPosition', container.scrollTop);
            return leaveAnimation(data);
        },
        enter(data) {
            return enterAnimation(data)
            },
        }
        ]});
        // {
        // name: 'project-to-home-transtion',
        // from: {
        //     namespace: ["project"]
        // },
        // to: {
        //     namespace: ["home"]
        // },
        // leave({current}) {
        //     console.log("to-home");
        //     // return leaveProjectAnimation(current.container);
        // },
        // enter({next}) {
        //     // return enterHomeAnimation(next.container)
        //     },
        // },
        // ]
  

    function findContent(data){
        if (data.trigger.trigger.childNodes[1].tagName === "VIDEO") {
            // If a video was clicked
            const clickedCardVideo = data.trigger.trigger.childNodes[1];
            return clickedCardVideo;
        }
        else if (data.trigger.trigger.childNodes[1].tagName === 'IMG'){
            // If an image was clicked
            // console.log("data.trigger.trigger.childnodes",data.trigger.trigger.childNodes[1])
            const clickedCardImage = data.trigger.trigger.childNodes[1];
            // console.log("clickedCardImage",clickedCardImage)
            return clickedCardImage;
        }
    }

    function findCard(container) {
        // Assuming you have a way to match the project content with a card (e.g., data-id or class name)
        const projectId = sessionStorage.getItem("activeProjectId"); // Store this during the `leave` transition
        if (!projectId) {
            console.error("No activeProjectId found.");
            return null;
        }
    
        // Find the matching card in the homepage container
        return matchingCard || null;
    }

    function swap([from,to]){
        let fromSlot = from.querySelector("#media").getAttribute("slot"),
            toSlot = to.querySelector("#media").getAttribute("slot"),
            fromID = from.getAttribute("data-flip-id") || "from" + gsap.utils.random(0, 9999, 1),
            toID = to.getAttribute("data-flip-id") || "to" + gsap.utils.random(0, 9999, 1);
        to.appendChild(from.media.assignedNodes()[0]);
        from.appendChild(to.media.assignedNodes()[0]);
        to.querySelector("#media").setAttribute("slot", toSlot);
        from.querySelector("#media").setAttribute("slot", fromSlot);
        to.setAttribute("data-flip-id", fromID);
        from.setAttribute("data-flip-id", toID);  

    }


});