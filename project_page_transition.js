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
    let intervalID;

    if ((window.location.pathname === '/' || window.location.pathname === 'home') && sessionStorage.getItem('returningFromProject') === 'true'){
            window.onload = function() {
                const savedScrollPosition = sessionStorage.getItem('scrollPosition');
                if(savedScrollPosition){
                    tl.to(window, {duration:0,scrollTo:savedScrollPosition});
                }
            }
                setTimeout(() =>{
                    sessionStorage.setItem('visitedHomepage', 'true');
                    sessionStorage.removeItem('returningFromProject');
                    homepageReturn();
                }, 100);
                
            }     
  
    
    

    // Check on the homepage
    if ((window.location.pathname === '/' || window.location.pathname === 'home') && sessionStorage.getItem('returningFromProject') === null) {
        console.log('loading Home')
        console.log(galleryContainer);
        sessionStorage.setItem('visitedHomepage', 'true');
    }

    //Check if on a project page
    if(window.location.pathname.startsWith('/work')){
        console.log("starts with work");
        //set a flag to indicate we came from the homepage
        if (sessionStorage.getItem('visitedHomepage') === 'true'){
            sessionStorage.setItem('returningFromProject','true');
            if(sessionStorage.getItem('lottieClicked') === 'true'){
                console.log('resuming animations');
                window.onload = function() {
                    resumeLottie()
                }
            }
        }
    }

    function waitForAnimationLoad(animation, callback) {
        if (animation.isLoaded) {
            callback();
        } else {
            animation.addEventListener('DOMLoaded', callback);
        }
    }
    
    //Resume the lottie file on the next page
    function resumeLottie(){
        let animationId = sessionStorage.getItem('animationId');
        // Get the lottie animation that matches the data source of the one passed
        console.log(animations);
        const matchingAnimationIndex = animations.findIndex(animation =>{
            // Assuming `animation.animationItem` contains a unique ID that matches the clicked SVG element
            return animation.wrapper.getAttribute('data-src') === animationId;
        })
        let pausedFrame = parseFloat(sessionStorage.getItem('pausedFrame'));
        const matchingAnimation = animations[matchingAnimationIndex];
        sessionStorage.setItem('matchingAnimationIndex', matchingAnimationIndex);
         // Wait for the animation to load before proceeding
        waitForAnimationLoad(matchingAnimation, () => {
        matchingAnimation.goToAndPlay(pausedFrame, true);
        console.log(`Resumed animation to frame: ${pausedFrame}`);;
        });
    }

    //Add event listener to links that point to the homepage
    homepageLinks.forEach(link => {
        link.addEventListener('click', navigateToHomepageWithAnimation);
    })

    // Detect when the page is loaded via the back button
    window.addEventListener('pageshow', (event) => {
        if (event.persisted){
            // console.log('pageshow|| Forward Or Back Button Clicked');
            // console.log("returning From project:",sessionStorage.getItem('returningFromProject'));
            // console.log("visited the homepage?:",sessionStorage.getItem('visitedHomepage'));
            // console.log("the event target pathname:", event.target.location.pathname);
            // console.log("the start of pathname for event target:", event.target.location.pathname.startsWith("/work"));
        if ((sessionStorage.getItem('returningFromProject') === 'true') && event.target.location.pathname === "/"){
            console.log("Page restored via back button or returning from project");
            console.log(event);
            checkLottie();
            playReturnAnimation();
            setTimeout(() =>{ 
            console.log("current Target:", event.target.location.href);
            console.log(event);
            overlayImageSource = sessionStorage.getItem("overlayImageSource");
            const savedScrollPosition = sessionStorage.getItem('scrollPosition');
                if(savedScrollPosition){
                    tl.to(window, {duration:0,scrollTo:savedScrollPosition});
                }
            sessionStorage.setItem('visitedHomepage', 'true');
            homepageReturn();
            }, 600);
        }
        if((sessionStorage.getItem('visitedHomepage') === 'true') && event.target.location.pathname.startsWith("/work")){
            console.log("forward to work");
            if (sessionStorage.getItem('visitedHomepage') === 'true'){
                sessionStorage.setItem('returningFromProject','true');
            }
        }
    }
        else{
            console.log("Page loaded normally");
            // Initialize animations for a fresh load
        }
    });

    //checks if lottie and gets frame
    function checkLottie(){
        //Check if the user came from the homepage
            if(sessionStorage.getItem('lottieClicked') === 'true'){
                let matchingAnimationIndex = sessionStorage.getItem('matchingAnimationIndex');
                console.log(animations);
                console.log(animations[matchingAnimationIndex]);
                animations[matchingAnimationIndex].pause();
                sessionStorage.setItem('pausedFrame', animations[matchingAnimationIndex].currentFrame);
                sessionStorage.removeItem('matchingAnimationIndex');
            }
    }

    //Function to navigate with animation if the link is to the homepage from a project
    function navigateToHomepageWithAnimation(event){
        //Prevent default navigation to control the timing of the redirect
        event.preventDefault();

        if(sessionStorage.getItem('returningFromProject') === 'true'){
            console.log("Playing animation before navigating to homepage");
            checkLottie();
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

            // Check if clickedCardImage is a regular <img> or part of a Lottie <svg>
        if (clickedCardImage.tagName === 'IMG') {
            // For standard images
            overlayImage.src = clickedCardImage.src; // Same image source
            overlayImage.srcset = clickedCardImage.srcset;
            overlayImage.sizes = clickedCardImage.sizes;
            sessionStorage.setItem('overlayImageSource', overlayImage.src);
        } else if (clickedCardImage.tagName === 'image') {
            // For Lottie animations (SVGs)
            const hrefValue = clickedCardImage.getAttribute('href');
            // console.log("href", hrefValue);
            if (hrefValue) {
                overlayImage.src = hrefValue;
                sessionStorage.setItem('overlayImageSource', overlayImage.src);
            }
            } else {
                console.warn('No active frame found in the Lottie animation.');
            }
        overlayImage.alt = clickedCardImage.alt;
        overlayImage.style.width = '100%';
        overlayImage.style.height = '100%';
        overlayImage.style.objectFit = 'cover';
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
                    if (clickedCardImage === null){
                        const lottieSVG  = parentCard.querySelector('svg');
                        console.log(lottieSVG );
                        let animationId = lottieSVG.parentElement.getAttribute('data-src')
                        sessionStorage.setItem('animationId', animationId);
                        const currentFrameImage = getCurrentFrameImage(lottieSVG);
                        const matchingAnimationIndex = animations.findIndex(animation =>{
                            // Assuming `animation.animationItem` contains a unique ID that matches the clicked SVG element
                            return animation.wrapper.getAttribute('data-src') === animationId;
                        })
                        animations[matchingAnimationIndex].pause();
                        sessionStorage.setItem('pausedFrame',animations[matchingAnimationIndex].currentFrame);
                        sessionStorage.setItem('lottieClicked', 'true');
                        if (currentFrameImage){
                            console.log("clicked lottie current image:",currentFrameImage);
                            updateOverlay(currentFrameImage);
                        }
                    }
                }   
            }
            if(clickedCardImage){
                console.log("clicked card image:",clickedCardImage);
                updateOverlay(clickedCardImage);
            }
            
            
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

    function getCurrentFrameImage(lottieSVG) {
        // Find all <g> elements within the Lottie SVG
        const gTags = lottieSVG.querySelectorAll('g');
    
        // Look for the <g> with 'display: block'
        const activeGTag = Array.from(gTags).find(g => g.style.display === 'block');
    
        if (!activeGTag) {
            console.warn('No active frame found in Lottie animation.');
            return null;
        }
    
        // Locate the <image> tag inside the active <g> tag
        sessionStorage.setItem("LottieFrameClass", activeGTag.getAttribute('class'));
        const imageTag = activeGTag.querySelector('image');
    
        if (!imageTag) {
            console.warn('No <image> tag found in the active frame.');
            return null;
        }
    
        return imageTag;
    }

    function checkForFrame(lottieSVG, lottieFrameClass) {
        const gTags = lottieSVG.querySelectorAll('g');
        console.log('Checking gTags:', gTags.length);
    
        /// Loop through the <g> tags and check for a match
        for (let index = 0; index < gTags.length; index++) {
            const gTag = gTags[index];
            // console.log(`gTag[${index}]:`, gTag.className.baseVal);
    
            if (gTag.className.baseVal === lottieFrameClass) {
                console.log("Found the matching gTag!");
                clearInterval(intervalID); // Stop the interval once found
                return gTag;
                // Continue with your next logic here
            }
        }
            return false;

        //Clear the interval to stop checking once the frame has been found
    }

    function onMatchingLottieFrame(matchingGalleryImage){
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
            delay: fadeDelay+.1,
            onComplete: () => {
                overlay.style.overflow = 'hidden';
                overlay.style.display = 'none';
                resumeLottie();
            }
        });
    }

    //Function to animate the return of the homepage 
    function homepageReturn(){
            sessionStorage.removeItem('returningFromProject');
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
                        const lottieSVG  = card.querySelector('svg');
                        if (lottieSVG){
                            const lottieFrameClass = sessionStorage.getItem("LottieFrameClass")
                            console.log("lottieOnCard:",lottieSVG);
                            // Declare intervalID outside of setInterval to ensure it's accessible
                            
                            // Run the check every 10ms
                            intervalID = setInterval(() => {
                                const matchingGTag = checkForFrame(lottieSVG, lottieFrameClass);
                                if (matchingGTag) {
                                    console.log('match found', matchingGTag);
                                    // Do further processing with matchingGTag if needed
                                    const hrefValue = matchingGTag.querySelector('image');
                                    onMatchingLottieFrame(hrefValue);
                                }
                            }, 150);
                        }
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
                                delay: fadeDelay+.1,
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
        window.location.assign(targetUrl.href)
        } else {
        console.error("No valid homepage link found.");
        }

        //After page has loaded , perform return animation

    }

});
