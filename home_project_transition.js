document.addEventListener("DOMContentLoaded", function () {
    barba.init({
        transitions: [{
        name: 'opacity-tranistion',
        leave(data) {
            return gsap.to(data.current.container,{
                opacity:0
            });
        },
        enter(data) {
            console.log("enter data:",data);
                // Reinitialize videos on new page load
                initializeVideos($(data.next.container));
            return gsap.to(data.next.container,{
                opacity:0
            });
        },
        }]
    });


    function initializeVideos($container) {
        console.log("filling sources");
        // Select all video elements with a data-src attribute
        $container.find('#mp4Video').each(function () {
            console.log('foundID');
            const $video = $(this); // The current video element
            const videoSrc = $video.data('src'); // Get the value of data-src
            
            // Set the source element's src attribute
            $video.find('source').attr('src', videoSrc);
            
            // Reload the video to apply the new src
            $video.find('video')[0].load();
        });
    };

    initializeVideos($('body'));
});