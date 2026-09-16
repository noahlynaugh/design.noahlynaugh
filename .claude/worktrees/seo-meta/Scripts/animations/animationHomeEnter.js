// animation to enter the gallery(home) page from a project page. 
import {gsap,Flip} from 'gsap/all';
gsap.registerPlugin(Flip);
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
        var moreElementsToFade = [elementsToFade, Array.from(data.next.container.children).filter(element => element !== document.querySelector("#Gallery-Container"))];
        var projectElements = [projectMedia.galleryText, projectMedia.buttonLink]

        gsap.set([projectMedia.media,projectElements,moreElementsToFade],{
            autoAlpha:0,
        });

        let media = [projectMedia,landerMedia]

        const state = Flip.getState(media);

        swap(media)

        if (projectMedia.media instanceof HTMLVideoElement){
            projectMedia.media.play()
        }

        tl.add(Flip.to(state, {
            targets: media,
            absolute:true, 
            nested: true,
            duration: .3,
            onComplete : () => {
                    gsap.set(projectMedia.media,{
                        autoAlpha:1
                    })
                }
        }));
        // tl.to([projectMedia.media,landerMedia.media],{
        //     scale: 1.2,
        //     duration: .3,
        // })
        tl.to([projectElements,moreElementsToFade],{
            stagger:0.1,
            autoAlpha:1,
            duration:.3
        });
        tl.totalDuration(.6)

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