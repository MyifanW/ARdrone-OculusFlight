ARdrone-OculusFlight
====================

A plugin to AR-Webflight that allows you to view and control the quadcopter with an oculus rift.

This is a plugin that allows you to control your ARdrone with a Oculus Rift. This was for VThacks, 4/2014.

Heavily referenced Oculus-drone by Diego Araos.

Requirements:
1- Node.js 
2- Ardone-webflight https://github.com/eschnou/ardrone-webflight
3- Oculus rift 

Instruction:
0. Install ardone-webflight 
1. copy the content of this plugin folder to ardone-webflight's plugin folder
2. open config.js in ardone-webflight, 
comment out video-stream, HUD and pilot, and then add:
"video-stream-oculus" // Display the video stream suitable for oculus rift stream
, "pilot-oculus"  // Pilot the drone using the oculus
, "hud-oculus" // HUD more suitable for oculus view - recommend to turn it off- 
* You can switch between oculus view and non oculus view by simply commenting out the plugin name 

3. set your oculus to extended desktop mode, 
4. Go to http://localhost:3000/ , to put your browser on the oculus screen, make sure it is horizonally correct, press f11 on your browser to enjoy an oculus view of drone's camera. 
 

To enable head movements: 
4. Download and run oculus-rest server (https://github.com/possan/oculus-rest) -there are better oculus servers out there, especially on windows ;)-
5. node .
Controls are the same as the pilot plugin, only controls are overwritten by headmotions. 
Taking off, landing, rising and falling are the same as the pilot commands.

Oculus's default position is set when you launch the program. That position is what the helicopter will believe is no actions.
 Terribly unintuitive, I know, it was a time crunch.
Forward is looking down at your feet. Back is looking up at the sky.
look over your shoulders to rotate left and right.
tilt your head quizzically left and right to strafe.

If you can make this better, by all means do it. I'm really inexperienced in Node.js, and approximately ran my brain into the code until it worked.

Oh, and I am not responsible for damages caused by using this plugin. It is difficult to control, and I suggest you test in a soft place and possibly tie a leash to the drone.
