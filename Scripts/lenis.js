let lenis; // Declare lenis outside so it's accessible

export function initLenis(wrapper) {
  if (!wrapper) {
    console.error("Lenis: No wrapper found!");
    return; // Prevent errors if wrapper doesn't exist
  }

  lenis = new Lenis({
    wrapper: wrapper,
    lerp: 0.1,
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  lenis.on('scroll', (e) => {
    console.log(e);
  });

  requestAnimationFrame(raf);
}

// Export a function to manually trigger Lenis updates
export function destroyLenis() {
  if (lenis) {
    lenis.destroy();
  }
}
