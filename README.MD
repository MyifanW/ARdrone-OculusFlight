This is a plugin that allows you to control your ARdrone with a Oculus Rift. This was for VThacks, 4/2014.

Heavily referenced Oculus-drone by Diego Araos.

I've borrowed his instructions as well.
0.replace pilot and video-stream folders in your plugin folder with mine. You can use my HUD folder too, which is slightly better for oculus use.
I don't know how to rename them, and I no longer have access to a drone so I can't test, so this is finished until I someday buy one. 
1. npm install
2. bower install
3. coffee -wc -o . .
4. Download and run oculus-rest server (https://github.com/possan/oculus-rest)
5. node .
6. Go to your browser http://localhost:3000/
Controls are the same as the pilot plugin, only controls are overwritten by headmotions. 
Taking off, landing, rising and falling are the same as the pilot commands.

Oculus's default position is set when you launch the program. That position is what the helicopter will believe is no actions.
 Terribly unintuitive, I know, it was a time crunch.
Forward is looking down at your feet. Back is looking up at the sky.
look over your shoulders to rotate left and right.
tilt your head quizzically left and right to strafe.

If you can make this better, by all means do it. I'm really inexperienced in Node.js, and approximately ran my brain into the code until it worked.

Oh, and I am not responsible for damages caused by using this plugin. It is difficult to control, and I suggest you test in a soft place and possibly tie a leash to the drone.