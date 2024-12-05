document.addEventListener("DOMContentLoaded", function () {

    // Initialize Barba.js
    barba.pjax.init();
    barba.prefetch.init();

    

        

        // Reinitialize videos after Barba.js finishes loading a new page
        Barba.Dispatcher.on('newPageReady', function () {
            initializeVideos();
        });
});