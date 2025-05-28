// barba.hooks.beforeEnter((data) => {
//     data.next.container.parentElement.querySelectorAll('.hover').forEach((element) =>{
//         textHoverAnimation(element);
//     });
//     data.next.container.querySelectorAll('.scalingHover').forEach((element) =>{
//         scalingHoverAnimation(element);
//     })
// });

// function textHoverAnimation(element) {
    
//     const textHoverAnimation =gsap.to(element, {
//         color: 'var(--color--hoverText)',
//         duration: .06, 
//         ease: "expoScale(0.5,7,power2.in)",
//         paused: true,
//     }) 
    

//     addListeners(element,textHoverAnimation)
    
// }

// function addListeners(element,animation){
//     // Add event listeners for interactions with the same in and out
//     element.addEventListener('pointerenter', (e) => {
//         animation.play()
//     });
//     element.addEventListener('pointerleave', (e) => {
//         animation.reverse()
//     });
//     element.addEventListener('pointerdown', (e) => {
//         animation.play()}
//     );
//     element.addEventListener('pointerup', (e) => {
//         animation.reverse()
//     });
//     element.addEventListener('pointercancel', (e) => {
//         animation.reverse()
//     });
// }


// function scalingHoverAnimation(element){

//     const scalingHoverAnimation = gsap.to(element, {
//         scale: 1.2,
//         duration: .1, 
//         paused: true,
//         ease: "expoScale(0.5,7,power2.in)",
//     });

//     addListeners(element,scalingHoverAnimation);
// }


