document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP and Flip
    gsap.registerPlugin(Flip);

    // Select image elements
    const pageTransitionContainer = document.querySelector('.gallery-container-page-transition');
    const galleryContainer = document.querySelector('#Gallery-Container');
    const overlay = document.querySelector('#overlay');
    const overlayImage = document.querySelector('#overlayImage');
    const projectPageLandingImage = document.querySelector('.project-page-landing-image');
    if ((sessionStorage.getItem('overlayImageSource') != null) && sessionStorage.getItem('returningFromProject') === 'true'){
        var overlayImageSource = sessionStorage.getItem('overlayImageSource');
        console.log("cleared:", overlayImageSource);
    }
    else{
        var overlayImageSource = "";
    }
    // Select links pointing to the homepage and add event listeners
    const homepageLinks = document.querySelectorAll('a[href="/"], a[href="/home"]');
    // Calculate elements to fade out on the homepage
    const elementsToFade = document.querySelectorAll(
        'body *:not(#navbar):not(#overlay):not(#overlayImage):not(#page-transition)'
    );
    const tl = gsap.timeline();
    var fadeDelay = .2;

    if ((window.location.pathname === '/' || window.location.pathname === 'home') && sessionStorage.getItem('returningFromProject') === 'true'){
            window.onload = function() {
                const savedScrollPosition = sessionStorage.getItem('scrollPosition');
                if(savedScrollPosition){
                    tl.to(window, {duration:0,scrollTo:savedScrollPosition});
                }
                homepageReturn();
            }     
  
        }
    

    // Check on the homepage
    if (window.location.pathname === '/' || window.location.pathname === 'home') {
        console.log('loading Home')
        console.log(galleryContainer);
        sessionStorage.setItem('visitedHomepage', 'true');
        setTimeout(() => {
        sessionStorage.removeItem('returningFromProject');
        }, 500);
        if (sessionStorage.getItem('returningFromProject') === 'false' || sessionStorage.getItem('returningFromProject') === null )
        {
            console.log("anim should be");
            galleryContainer.style.opacity = '0';
            tl.to(galleryContainer, {
                opacity: 1,
                duration: .2,
                ease: "power3.in"
            })
        }
    }

    //Check if on a project page
    if(window.location.pathname.startsWith('/work')){
        //set a flag to indicate we came from the homepage
        if (sessionStorage.getItem('visitedHomepage') === 'true'){
            sessionStorage.setItem('returningFromProject','true');
        }
    }

    //Add event listener to links that point to the homepage
    homepageLinks.forEach(link => {
        link.addEventListener('click', navigateToHomepageWithAnimation)
    })

    // Detect when the page is loaded via the back button
    window.addEventListener('pageshow', (event) => {
        if (event.persisted || sessionStorage.getItem('returningFromProject') === 'true' && event.target.location.href === "/"){
            console.log("Page restored via back button or returning from project");
            console.log(event);
            playReturnAnimation();
            setTimeout(() =>{ 
            console.log("current Target:", event.target.location.href);
            console.log(event);
            overlayImageSource = sessionStorage.getItem("overlayImageSource");
            const savedScrollPosition = sessionStorage.getItem('scrollPosition');
                if(savedScrollPosition){
                    tl.to(window, {duration:0,scrollTo:savedScrollPosition});
                }
            homepageReturn();
            }, 600);
        }
    });


    //Function to navigate with animation if the link is to the homepage from a project
    function navigateToHomepageWithAnimation(event){
        //Prevent default navigation to control the timing of the redirect
        event.preventDefault();

        //Check if the user came from the homepage
        if(sessionStorage.getItem('returningFromProject') === 'true'){
            console.log("Playing animation before navigating to homepage");

            playReturnAnimation();
            setTimeout(() =>{
                //After animation completes, nav to the homepage
                navigateToHomepageURL(event);
            }, 600);
            // Clear the flags after navigation
            sessionStorage.removeItem('visitedHomepage');
        }
        else {
            navigateToHomepageURL(event);
            }
        }
    

    //Creates initial state to animate
    function updateOverlay(clickedCardImage){
        const rect = clickedCardImage.getBoundingClientRect();
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.top = `${rect.top }px`;
        overlay.style.left = `${rect.left}px`;
        
        overlayImage.src = clickedCardImage.src; // Same image source
        sessionStorage.setItem('overlayImageSource', overlayImage.src);
        overlayImage.alt = clickedCardImage.alt;
        overlayImage.style.width = '100%';
        overlayImage.style.height = '100%';
        overlayImage.style.objectFit = 'cover';
        overlayImage.srcset = clickedCardImage.srcset;
        overlayImage.sizes = clickedCardImage.sizes;
    }

    //Animating to project page
    document.querySelectorAll('#Gallery-Card-Image-This').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent immediate navigation
            let clickedCardImage;
            if (event.target.tagName === 'IMG') {
                // If the image itself was clicked
                clickedCardImage = event.target;
            } else {
                const parentCard = event.target.closest('.gallery-card-container');
                // If another element was clicked (like the button), find the image
                if (parentCard){
                    clickedCardImage = parentCard.querySelector('img');
                }   
            }
            console.log(clickedCardImage);
            updateOverlay(clickedCardImage);

            overlay.style.display = 'block'; // Show overlay

            // Capture the initial FLIP state of the overlay image
            const  projectPageState = Flip.getState(overlayImage);
            
            // Move overlayImage into pageTransitionContainer
            pageTransitionContainer.appendChild(overlayImage);
            pageTransitionContainer.style.zIndex = '10';
            pageTransitionContainer.style.opacity = '1';

            tl.to(elementsToFade, {
                opacity: 0,
                duration: fadeDelay,
                ease: "power1.out",
            })
         
                Flip.from( projectPageState, {
                    duration: fadeDelay,
                    ease: "power1.out",
                    absolute: true,
                    delay: fadeDelay,
                    onComplete: () =>{
                        // Navigate to the new page after the animation
                        if (window.location.pathname === '/' || window.location.pathname === '/home') {
                                sessionStorage.setItem('scrollPosition', window.scrollY);
                        }
                        window.location.href = link.href;
                    }
                });         
        });
    });

    //Animating back to homepage
    function playReturnAnimation(){
         // Simulate an animation by using a timeout (e.g., 2 seconds)
        console.log("Return Animation starting...");
        tl.to(window, {duration:.3,scrollTo:0, ease:"power1.out"});
        tl.to(projectPageLandingImage, {opacity: 0, duration:.3, ease: 'power3.in', onComplete: () =>{
            console.log("completed return animation");
            }
        });

    }

    

    //Function to animate the return of the homepage 
    function homepageReturn(){
            overlayImage.style.opacity = '0';
            pageTransitionContainer.appendChild(overlayImage);
            overlayImage.src = overlayImageSource;
            overlayImage.style.width = '100%';
            overlayImage.style.height = '100%';
            overlayImage.style.objectFit = 'cover';
            pageTransitionContainer.style.zIndex = '10'; 
            elementsToFade.forEach(element => element.style.opacity = '0');
            tl.to(overlayImage, {
                opacity: 1,
                duration: .3,
                ease: "power3.in",
                onComplete: () =>{
                    //find the gallery image that matches 'overlayImageSource'
                    const galleryCardImages = document.querySelectorAll('#Gallery-Card-Image-This');
                    galleryCardImages.forEach((card) => {
                        const img = card.querySelector('img');
                        if (img){
                            const imgSrc = img.src;
                        if (imgSrc === overlayImageSource){
                    var matchingGalleryImage = img;
                    if (matchingGalleryImage) {
                        console.log("Found matching gallery image:", matchingGalleryImage);
                        //Update overlay with the target gallery's image position and dimensions
                        updateOverlay(matchingGalleryImage);
                        overlay.style.display = 'block'; // Show overlay
                        overlay.style.overflow = 'visible';
                        const returnState = Flip.getState(overlayImage);
                        //Move overlay image out of the page transition container and set up for animation
                        pageTransitionContainer.removeChild(overlayImage);
                        overlay.appendChild(overlayImage);
                        pageTransitionContainer.style.zIndex = '-1';
                        pageTransitionContainer.style.opacity = '0';
                        
        
                        Flip.from(returnState,{
                            duration: fadeDelay,
                            ease: "power1.out",
                            absolute: true,
                        })
        
                        tl.to(elementsToFade, {
                            opacity: 1,
                            duration: fadeDelay,
                            ease: "power1.out",
                            delay: fadeDelay,
                            onComplete: () => {
                                overlay.style.overflow = 'hidden';
                                overlay.style.display = 'none';
                            }
                        });
                    }
                    else{
                        console.warn("No matching gallery image found.");
                    }
                }
            }
            
            });
                }
            })
            
    }

    //Function To nav back to homepage url correctly
    function navigateToHomepageURL(event){
        // Get the closest anchor element in case event target is not <a>
        const targetLink = event.target.closest('a');

        if (targetLink) {
        const targetUrl = new URL(targetLink.href, window.location.origin);
        overlayImageSource = sessionStorage.getItem("overlayImageSource");
        window.location.assign(targetUrl.href)
        } else {
        console.error("No valid homepage link found.");
        }

        //After page has loaded , perform return animation

    }

});
