// animation to enter the gallery(home) page from a project page. 

import {swap} from '../swap.js';

 const enterHomeAnimation = (data) => {
        const tl = gsap.timeline({
            defaults:{
                ease: 'power4.out',
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

        tl.set(moreElementsToFade,{
            autoAlpha:0,
        });

        const media = [landerMedia,projectMedia]

        const state = Flip.getState(media);

        swap(media)

        tl.add(Flip.from(state, {
            absolute:true,
            nested: true,
            duration: 2,
            onUpdate: () =>{

            }
        }));
        // tl.to(moreElementsToFade,{
        //     stagger:0.2,
        //     autoAlpha:1,
        //     duration:3
        // });

        return tl
    }

    function findCard(container) {
        // Assuming you have a way to match the project content with a card (e.g., data-id or class name)
        const projectId = sessionStorage.getItem("activeProjectId"); // Store this during the `leave` transition
        const fileName = decodeURIComponent(new URL(projectId).pathname);
        if (!projectId) {
            console.error("No activeProjectId found.");
            return null;
        }

        const matchingCard = container.querySelector(`[src="${fileName}"]`);

        // Find the matching card in the homepage container
        return matchingCard || null;
    }    

export default enterHomeAnimation;