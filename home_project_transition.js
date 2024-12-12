document.addEventListener("DOMContentLoaded", function () {
    // Register GSAP and Flip
    gsap.registerPlugin(Flip);

    initializeVideos($('body'));

    const leaveAnimation = (data) => {
        //Find the content that links to the project interacted with
        // Fade all elements but content
        const galleryCardContainer = (data.trigger.parentElement);
        const elementsToFade = galleryCardContainer.querySelectorAll(".button-link.w-inline-block, .w-layout-vflex.gallery_text");
        const moreElementsFade = data.current.container.querySelectorAll("#Gallery-Container,#Footer");
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
                    const projectId = content.dataset.src|| content.src; // Use your specific identifier
                    console.log(projectId);
                    sessionStorage.setItem("activeProjectId", projectId);
                }
            }
        });
        tl.to(moreElementsFade, {
            autoAlpha:0,
            ease: "power2.in",
        }, "-=.05")
        
        
        
        //return the timeline animation 
        return tl;
    }

    const enterAnimation = (container) => {
    
        const lander = container.querySelector(".lander");
        const landerContainer = lander.childNodes[0];
        const imgContainer = lander.parentElement;
        const overlay = document.querySelector(".overlay");
        const content = overlay.childNodes[0];
        // Remove all children from landerContainer
        if (landerContainer){
            landerContainer.innerHTML = ""
        }
        else if (lander){
            // Find the image container
            imgContainer.innerHTML = "";
        };
        const state = Flip.getState(content);

        if (landerContainer){
            landerContainer.appendChild(content);
        }
        else if(lander)
        {
            content.removeAttribute("style");
            // Add the new class
            content.classList = (lander.className);
            imgContainer.appendChild(content);
            

        };
        // Create a GSAP timeline and add Flip animation to it
        const tl = gsap.timeline({
        defaults:{
            ease: 'power6.out',
            duration: .3
        }
        });
        // Add the Flip animation to the timeline
            tl.add(Flip.from(state, {
                zIndex: 12,
                duration:.4,
                ease: 'power3.out',
            }));
        return tl; // Return the timeline for Barba to wait on
        
    }

    const leaveProjectAnimation = (container) => {
        const tl = gsap.timeline({
            defaults:{
                ease: 'power4.out',
                duration: .6
            }
        });

        tl.to(container,{
            scrollTo:0,
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
        enter({next}) {
            // Reinitialize videos on new page load
            initializeVideos($(next.container));
            return enterAnimation(next.container)
            },
        },
        {
        name: 'project-to-home-transtion',
        from: {
            namespace: ["project"]
        },
        to: {
            namespace: ["home"]
        },
        leave({current}) {
            console.log("to-home");
            return leaveProjectAnimation(current.container);
        },
        enter({next}) {
            // Reinitialize videos on new page load
            initializeVideos($(next.container));
            return enterHomeAnimation(next.container)
            },
        },
        ]
    });


    function initializeVideos($container) {
        console.log("filling sources");
        // Select all video elements with a data-src attribute
        $container.find('.video').each(function () {
            const $video = $(this); // The current video element
            const videoSrc = $video.data('src'); // Get the value of data-src
            
            // Set the source element's src attribute
            $video.find('source').attr('src', videoSrc);
            
            // Reload the video to apply the new src
            $video.find('video')[0].load();
        });
    };

    function findContent(data){
        if (data.trigger.childNodes[0].className === "video w-embed") {
            // If a video was clicked
            const clickedCardVideo = data.trigger.childNodes[0];
            updateOverlay(clickedCardVideo, 0);
            return clickedCardVideo;
        }
        else if (data.trigger.className === "button-link w-inline-block"){
            // If the button on the card was clicked
            const parentCard = data.trigger.closest('.gallery-card-container');
            if (parentCard){
                const clickedCardImage = parentCard.querySelector('.card-project-image');
                const clickedCardVideo = parentCard.querySelector('#mp4Video')
                if (clickedCardImage){
                    updateOverlay(clickedCardImage, 1);
                    return clickedCardImage;
                }
                if (clickedCardVideo){
                    updateOverlay(clickedCardVideo, 0);
                    return clickedCardVideo;
                }
                else{
                    console.error("no content in card");
                }
            }
        }
        else if (data.trigger.childNodes[0].className === 'card-project-image'){
            // If an image was clicked
            const clickedCardImage = data.trigger.childNodes[0];
            updateOverlay(clickedCardImage, 1);
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
        const matchingCard = container.querySelector(`[data-src="${projectId}"], [src="${projectId}"]`);
        return matchingCard || null;
    }

    //Creates initial state to animate
    function updateOverlay(content, contentType){
        const overlay = document.querySelector('#overlay');
        const overlayImage = document.querySelector('#overlayImage');
        const rect = content.getBoundingClientRect();
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.top = `${rect.top }px`;
        overlay.style.left = `${rect.left}px`;
        if (contentType == 0){
            console.log("Content is a video",content);
            overlay.innerHTML = ""; // Clear overlay
            overlay.appendChild(content.cloneNode(true)); // Clone and append video
        }
        else if (contentType == 1){
            console.log("Content is an image",content);
            // For standard images
            overlayImage.src = content.src; // Same image source
            overlayImage.srcset = content.srcset;
            overlayImage.sizes = content.sizes;
            overlayImage.alt = content.alt;
            overlayImage.style.width = '100%';
            overlayImage.style.height = '100%';
            overlayImage.style.objectFit = 'cover';
        }
        // Make overlay visible
        overlay.style.display = 'block';
    }
});