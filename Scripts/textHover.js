document.querySelectorAll('.hover').forEach((element) => {
    //should only work on text elements with hover
        textHoverAnimation(element);
    //
});

document.querySelectorAll(".scalingHover").forEach(element => {
        scalingHoverAnimation(element);
});

barba.hooks.beforeEnter((data) => {
    data.next.container.querySelectorAll('.hover').forEach((element) =>{
        textHoverAnimation(element);
    });
    data.next.container.querySelectorAll('.scalingHover').forEach((element) =>{
        scalingHoverAnimation(element);
    })
});

function textHoverAnimation(element) {
    
    function getHoverColor() {
        const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
        if(colorPreference.matches){
            const hoverColor = 'var(--color--dark--hoverText)';
            return hoverColor
        }
        else{
            const hoverColor = 'var(--color--hoverText)';
            return hoverColor
        }
    }
    const hoverColor=getHoverColor();

    const textHoverAnimation = gsap.to(element, {
        color: hoverColor,
        //**
        textDecoration: 'var(--color--background--hover)',
        //**i want this bkg to be an underline of the element
        borderRadius: '4px',
        duration: .06, 
        paused: true,
        ease: "expoScale(0.5,7,power2.in)",
    });

    addListeners(element,textHoverAnimation);
    
}

function addListeners(element,animation){
    // Add event listeners for interactions
    element.addEventListener('pointerenter', (e) => {
        console.log("pointerEnter",e); 
        animation.play()
    });
    element.addEventListener('pointerleave', (e) => {
        console.log("pointerLeave",e);
        animation.reverse()
    });
    element.addEventListener('pointerdown', (e) => {
        console.log("pointerDown",e);
        animation.play()}
    );
    element.addEventListener('pointerup', (e) => {
        console.log("pointerUp",e);
        animation.reverse()
    });
    element.addEventListener('pointercancel', (e) => {
        console.log("cancel",e);
        animation.reverse()
    });
}


function scalingHoverAnimation(element){

    const scalingHoverAnimation = gsap.to(element, {
        scale: 1.1,
        duration: .1, 
        paused: true,
        ease: "expoScale(0.5,7,power2.in)",
    });

    addListeners(element,scalingHoverAnimation);
}


