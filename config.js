var config = {
        plugins: [
        //   "video-stream"  // Display the video as a native h264 stream decoded in JS 
        // "video-stream-oculus" // Display the video stream suitable for oculus rift stream
        //  , "hud"           // Display the artificial horizon, altimeter, compass, etc.
        //  , "hud-oculus"           // Better setting for Oculus
          , "pilot"         // Pilot the drone with the keyboard
        //, "pilot-oculus"  // Pilot the drone using the oculus
        ],

        // Config for pilot plugin
        keyboard: 'azerty',

        // Config for blackbox plugin. Path is an existing folder where to store mission data
        // Each new mission will have its own timestamped folder.
        blackbox: {
        },

        // Config for replay plugin. Path points to a specific mission folder to be replayed.
        replay: {
        }
};

module.exports = config;

