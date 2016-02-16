$(function() {

    var now = new Date();
    var startTime = moment(now);
    var fainal = moment(startTime).add("minutes", 30).format("D YYYY, h:mm:ss a");
    var getCurrentTime = videoList.serverTime;
    var getVideos = videoList.videos;
    var nowPlaying = '';
    var nowTime = 0;

    // Initialize LivePlayer
    $.ajax({
        type: "GET",
        url: livetvPlayList
    }).done(function(data) {
        videoList = data;
        getCurrentTime = videoList.serverTime;
        getVideos = videoList.videos;
        //console.log(videoList);
        initLivePlayer();
    });

    // Get First video details
    if (_.isEmpty(getVideos)) {
        var firstVideo = '';
        var firstSecound = '0';
    } else {
        var firstVideo = getVideos[0].videoId;
        var firstSecound = getVideos[0].startSeconds;
    }

    // Get Browser Sizes
    var playerWidth = tubeContaienrWrapper.width();
    var hvalue = playerWidth;
    hvalue *= 1;
    var playerHeight = Math.round((hvalue / 16) * 9);
    window.onresize = function(event) {
        var playerWidth = tubeContaienrWrapper.width();
        var hvalue = playerWidth;
        hvalue *= 1;
        var playerHeight = Math.round((hvalue / 16) * 9);
        console.log('Resized ' + playerWidth);
        initLivePlayer();
    };

    // Player Init fn
    function initLivePlayer() {
        domYouTubeContainer.tubeplayer({
            width: playerWidth, // the width of the player
            height: playerHeight, // the height of the player
            allowFullScreen: "", // true by default, allow user to go full screen
            initialVideo: firstVideo, // the video that is loaded into the player
            preferredQuality: "default", // preferred quality: default, small, medium, large, hd720
            start: firstSecound,
            showControls: 0, // whether the player should have the controls visible, 0 or 1
            showRelated: 0, // show the related videos when the player ends, 0 or 1
            autoPlay: false, // whether the player should autoplay the video, 0 or 1
            autoHide: true,
            theme: "light", // possible options: "dark" or "light"
            color: "white", // possible options: "red" or "white"
            showinfo: false, // if you want the player to include details about the video
            modestbranding: true, // specify to include/exclude the YouTube watermark
            wmode: "transparent", // note: transparent maintains z-index, but disables GPU acceleration
            swfobjectURL: "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
            loadSWFObject: true, // if you include swfobject, set to false
            iframed: false, // iframed can be: true, false; if true, but not supported, degrades to flash
            protocol: 'https',
            onPlay: function(id) {}, // after the play method is called
            onPause: function() {}, // after the pause method is called
            onStop: function() {}, // after the player is stopped
            onSeek: function(time) {}, // after the video has been seeked to a defined point
            onMute: function() {}, // after the player is muted
            onUnMute: function() {}, // after the player is unmuted
            onPlayerUnstarted: function() {}, // when the player returns a state of unstarted
            onPlayerEnded: function() {}, // when the player returns a state of ended
            onPlayerPlaying: function() {}, //when the player returns a state of playing
            onPlayerPaused: function() {}, // when the player returns a state of paused
            onPlayerBuffering: function() {}, // when the player returns a state of buffering
            onPlayerCued: function() {}, // when the player returns a state of cued
            onQualityChange: function(quality) {}, // a function callback for when the quality of a video is determined
            onErrorNotFound: function() {}, // if a video cant be found
            onErrorNotEmbeddable: function() {}, // if a video isnt embeddable
            onErrorInvalidParameter: function() {} // if we've got an invalid param
        });
    }

    // Initialize Player redy functions
    $.tubeplayer.defaults.afterReady = function($player) {
            console.log('Player Ready');
            // Count for next video play each 5 sec
            setTimeout(function() {
                playVideoOnTime(videoList);
            }, 1000);
            // Count for next video play each 5 sec
            setInterval(function() {
                lookForUpdate(moment());
            }, 3000);
        }

    // Chk For new Updates
    function lookForUpdate(thetime) {
        var getVideos;
        // Request to api
        $.ajax({
            type: "GET",
            url: livetvPlayList
        }).done(function(data) {
            /////////
            getCurrentTime = data.serverTime;
            getVideos = data.videos;
            $.each(getVideos, function(key, value) {
                // See if any video should be played now
                var now = moment(thetime).format('DD/MM/YYYY hh:mm:ss A');
                var then = moment().format('DD/MM/YYYY') + " " + value.startTime;
                var timeDiff = moment.duration(moment(now, "DD/MM/YYYY HH:mm:ss") - moment(then, "DD/MM/YYYY HH:mm:ss")).asSeconds();
                // Log
                //console.log('Video ID :' + value.videoId + ' in : ' + timeDiff + ' at : ' + value.startSeconds);
                /////////
                // Logic to play next video
                if ((timeDiff > 1) && (timeDiff < 5)) {
                    domYouTubeContainer.tubeplayer("play", {
                        id: value.videoId,
                        time: value.startSeconds
                    });
                } else {}
            });
        });
    }

    // Play Video by time
    function playVideoOnTime(videodata) {
        $.each(getVideos, function(key, value) {
            // See if any video should be played now
            if ((value.startSeconds > 1)) {
                //console.log('Video ID :' + value.videoId + ' at : ' + value.startSeconds);
                domYouTubeContainer.tubeplayer("play", {
                    id: value.videoId,
                    time: value.startSeconds
                });
            }
        });
    }
});
