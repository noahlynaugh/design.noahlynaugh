import {gsap,SplitText} from "gsap/all"
gsap.registerPlugin(SplitText);

const aboutEnterAnimation = (container,reverse) => {
    const tl = gsap.timeline({
        });
    var elementsToFade = Array.from(container.querySelector('#aboutContainer').children);
        elementsToFade = elementsToFade.filter(element => (element !== document.querySelector('#headline')));
    let split = SplitText.create('#headline',{ type: "words, chars"});
    
    
    if(reverse){
        tl.from(split.chars,{
            autoAlpha: 0,
            duration: 2,
            y:  75,
            x: 10,
            scale: .25,
            ease: 'back.out(2)',
            stagger: 0.01,
        })
        tl.from(elementsToFade,{
            autoAlpha:0
        },'-=1.8')
        tl.totalDuration(.6)
        return tl.reverse(0)
    }
    else{
        tl.from(split.chars,{
            autoAlpha: 0,
            duration: 2,
            y: -75,
            x: -10,
            scale: 1.8,
            ease: 'elastic.out(2,1)',
            stagger: 0.02,
        })
        tl.from(elementsToFade,{
            autoAlpha:0,
            duration:1,
            stagger: .05
        },'-=1.8')
        tl.totalDuration(1)
        return tl
    }
    
}

export default aboutEnterAnimation;