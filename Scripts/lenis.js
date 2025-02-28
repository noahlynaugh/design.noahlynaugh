// init lenis
const lenis = new Lenis({
    wrapper: document.querySelector('[data-barba="wrapper"]'),
    content: document.querySelector('[data-scroll-container]'),
    eventsTarget: document.querySelector('[data-barba="container"]'),
    lerp: 0.1,
    smooth: true,
  });
  
  const loop = (time) => {
    lenis.raf(time);
    requestAnimationFrame(loop);
  };

    // Listen for the scroll event and log the event data
    lenis.on('scroll', (e) => {
        console.log(e);
    });
  
  requestAnimationFrame(loop);
  
