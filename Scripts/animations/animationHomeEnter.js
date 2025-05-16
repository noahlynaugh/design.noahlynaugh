// animation to enter the gallery(home) page from a project page. 

import {swap} from '../swap.js';

 const enterHomeAnimation = (data) => {
        const tl = gsap.timeline({
            defaults:{
                ease: 'power4.in',
                duration: .6
            }
        });
        
        const scrollPos = sessionStorage.getItem('scrollPosition');
        const landerMedia = data.current.container.querySelector('project-lander');
        const matchingCard = findCard(data.next.container);
        const projectMedia = matchingCard.closest("gallery-card");
        const link = projectMedia.link;

        var elementsToFade = Array.from(data.next.container.querySelector("#Gallery-Container").children);
        elementsToFade = elementsToFade.filter(element => (element.link != link));
        var moreElementsToFade = [projectMedia.galleryText, projectMedia.buttonLink, elementsToFade, Array.from(data.next.container.children).filter(element => element !== document.querySelector("#Gallery-Container"))];

        gsap.set([projectMedia,moreElementsToFade],{
            autoAlpha:0,
            duration:0
        });

        let media = [projectMedia,landerMedia]

        swap(media)

        const state = Flip.getState(media);

        tl.add(Flip.to(state, {
            targets: media,
            absolute:true, 
            nested: true,
            duration: .3,
            onComplete : () => {
                if (projectMedia.querySelector("video") instanceof HTMLVideoElement) {
                    projectMedia.querySelector("video").currentTime = landerMedia.querySelector("video").currentTime;
                    tl.set(projectMedia,{
                        autoAlpha:1
                    })
                }
                else{
                    tl.set(projectMedia,{
                        autoAlpha:1
                    })
                }
            }
        }));
        tl.to([projectMedia.media,landerMedia.media],{
            scale: 1.2,
            duration: .3,
        })
        tl.to([moreElementsToFade],{
            stagger:0.1,
            autoAlpha:1,
            duration:.3
        });

        return tl
    }

    function findCard(container) {
        // Assuming you have a way to match the project content with a card (e.g., data-id or class name)
        const projectId = sessionStorage.getItem("activeProjectId"); // Store this during the `leave` transition
        if (!projectId) {
            console.error("No activeProjectId found.");
            return null;
        }
        const fileName = decodeURIComponent(new URL(projectId).pathname);
        const matchingCard = container.querySelector(`[src="${fileName}"]`);

        // Find the matching card in the homepage container
        return matchingCard || null;
    }    

export default enterHomeAnimation;