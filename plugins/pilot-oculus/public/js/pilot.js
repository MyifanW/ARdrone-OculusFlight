PILOT_ACCELERATION = 0.02;

(function(window, document, $, undefined) {
        'use strict';

        var keyCodeMap    = {"0":"96","1":"97","2":"98","3":"99","4":"100","5":"101","6":"102","7":"103","8":"104","9":"105","backspace":"8","tab":"9","return":"13","shift":"16","ctrl":"17","alt":"18","pausebreak":"19","capslock":"20","escape":"27"," ":"32","pageup":"33","pagedown":"34","end":"35","home":"36","left":"37","up":"38","right":"39","down":"40","+":"107","printscreen":"44","insert":"45","delete":"46",";":"186","=":"187","a":"65","b":"66","c":"67","d":"68","e":"69","f":"70","g":"71","h":"72","i":"73","j":"74","k":"75","l":"76","m":"77","n":"78","o":"79","p":"80","q":"81","r":"82","s":"83","t":"84","u":"85","v":"86","w":"87","x":"88","y":"89","z":"90","*":"106","-":"189",".":"190","/":"191","f1":"112","f2":"113","f3":"114","f4":"115","f5":"116","f6":"117","f7":"118","f8":"119","f9":"120","f10":"121","f11":"122","f12":"123","numlock":"144","scrolllock":"145",",":"188","`":"192","[":"219","\\":"220","]":"221","'":"222"};
          ;
		  
		var diffAngles, keys, queryOculusAngles, setOculusAngle;

        var forward  = 'w'
          , backward = 's'
          , left     = 'a'
          , right    = 'd'
          , flip     = 'f'
          , channel  = 'c'
          ;
        if      (options && options.keyboard === 'qwerty') { }
        else if (options && options.keyboard === 'azerty') {
          forward  = 'z';
          backward = 's';
          left     = 'q';
          right    = 'd';
        }
		keys ={};
        // Static keymap used within this module
        var Keymap = {
          38 : {
            ev : 'move',
            action : 'up'
          },
          40 : {
            ev : 'move',
            action : 'down'
          },
          37 : {
            ev : 'move',
            action : 'counterClockwise'
          },
          39 : {
            ev : 'move',
            action : 'clockwise'
          },
          32 : {
            ev : 'drone',
            action : 'stop'
          },
          84 : {
            ev : 'drone',
            action : 'takeoff'
          },
          76 : {
            ev : 'drone',
            action : 'land'
          },
          69 : {
            ev : 'drone',
            action : 'disableEmergency'
          },
          70 : {
            ev : 'animate',
            action : 'flip'
          }
        };
        Keymap[keyCodeMap[forward]]  = {
          ev : 'move',
          action : 'front'
        };
        Keymap[keyCodeMap[backward]] = {
          ev : 'move',
          action : 'back'
        };
        Keymap[keyCodeMap[left]]     = {
          ev : 'move',
          action : 'left'
        };
        Keymap[keyCodeMap[right]]    = {
          ev : 'move',
          action : 'right'
        };
        Keymap[keyCodeMap[channel]]  = {
          ev : 'channel'
        };

        /*
         * Constructuor
         */
        var Pilot = function Pilot(cockpit) {
                console.log("Loading Pilot plugin.");
                this.cockpit = cockpit;
                this.speed = 0;
                this.moving = false;
                //keys = {};

                // Add the buttons to the control area
                $('#controls').append('<input type="button" id="ftrim" value="Flat trim">');
                $('#controls').append('<input type="button" id="calibratemagneto" value="Calibrate magneto">');
				$('#cockpit').append('<div id ="lastOculusAngle">blarg</div>');
				$('#cockpit').append('<div id ="refCoord"> x </div>');
				$('#cockpit').append('<div id ="ansCoord"> y </div>');
				$('#cockpit').append('<div id ="checkCoord"> x </div>');
				$('#cockpit').append('<div id ="checkCoord2"> x </div>');
				$('#cockpit').append('<div id ="checkCoord3"> x </div>');
				
                // Start with magneto calibration disabled.
                $('#calibratemagneto').prop('disabled', true);

                // Register the various event handlers
                this.listen();

                // Setup a timer to send motion command
                var self = this;
                setInterval(function(){self.sendCommands()},100);
				
				setInterval(queryOculusAngles, 10);
				setInterval(renderOculusControl, 10);
        };
		
		/*
		 * TEST CODE STARTS HERE
		 */
		 
		 window.useOculusControl = false;

		 window.referenceOculusAngle = null;

		 window.prevControl = null;
		queryOculusAngles = function() 
		{
			return $.get('http://localhost:50000', function(response, error) 
			{
				//rotations. I need to put the very first data somewhere.
				$('#lastOculusAngle').text(response.euler.y + " " + response.euler.p + " " + response.euler.r);
				if (!window.useOculusControl) {
					window.useOculusControl = true;
					$('#refCoord').text(response.euler.y + " " + response.euler.p + " " + response.euler.r);
					window.referenceOculusAngle = response;
				}
				return window.lastOculusAngle = response;
			});
		};
		
		
		window.diffOculusAngle = function() {
			if (window.useOculusControl && window.referenceOculusAngle) {
			  return {
				euler: {
				  y: +diffAngles(window.referenceOculusAngle.euler.y, window.lastOculusAngle.euler.y),
				  p: +diffAngles(window.referenceOculusAngle.euler.p, window.lastOculusAngle.euler.p),
				  r: -diffAngles(window.referenceOculusAngle.euler.r, window.lastOculusAngle.euler.r)
				}
			  };
			}
		  };
		window.renderOculusControl = function() {
			var $oculusControl, $oculusControlPad, diffAngle, diffScale, diffThreshold, oculusControl;
			if (!window.useOculusControl || !(diffAngle = window.diffOculusAngle())) {
			  return;
			}
			diffThreshold = {
			  y: 0.3,
			  p: 0.05,
			  r: 0.05
			};
			diffScale = {
			  y: 0.5,
			  p: 0.3,
			  r: 0.3
			};
			oculusControl = {
			  x: 0,
			  y: 0,
			  r: 0
			};
			
			$('#rCoord').text("fuupgadshg");	
			if (Math.abs(diffAngle.euler.y) > diffThreshold.y) 
			{
			  //window.$oculusOSD.append(diffAngle.euler.y > 0 ? "CW " : "CWW ");
			  if (window.useOculusControl) {
				oculusControl.r = diffAngle.euler.y * diffScale.r;
			  }
			}
			if (Math.abs(diffAngle.euler.p) > diffThreshold.p) 
			{
			  //window.$oculusOSD.append(diffAngle.euler.p > 0 ? "FORWARD " : "BACKWARD ");
			  if (window.useOculusControl) {
				oculusControl.y = diffAngle.euler.p * diffScale.p;
			  }
			}
			if (Math.abs(diffAngle.euler.r) > diffThreshold.r) 
			{
			  //window.$oculusOSD.append(diffAngle.euler.r > 0 ? "LEFT " : "RIGHT ");
			  if (window.useOculusControl) {
				oculusControl.x = diffAngle.euler.r * diffScale.r;
			  }
			}
			
			$('#ansCoord').text(oculusControl.r + " " + oculusControl.y + " " + oculusControl.x);
			if(oculusControl.x > 0.13)
			{
				$('#checkCoord').text("tilting left ");
				
				var currkey = keyCodeMap[left];
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = keyCodeMap[left];
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}
			if(oculusControl.x < -0.13)
			{
				$('#checkCoord').text("tilting right ");
				
				var currkey = keyCodeMap[right];
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = keyCodeMap[right];
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}
			//if rotation somethinasgakj'dg
			if(oculusControl.r < -0.15)
			{
				$('#checkCoord').text("turning right");
				
				var currkey = 37;
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = 37;
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}
			if(oculusControl.r > 0.15)
			{
				$('#checkCoord').text("turning Right");
				
				var currkey = 39;
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = 39;
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}if(oculusControl.r > 0.15)
			{
				$('#checkCoord').text("turning Right");
				
				var currkey = 39;
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = 39;
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}
			if(oculusControl.y < -0.11)
			{
				$('#checkCoord').text("turning back ");
				
				var currkey = keyCodeMap[backward];
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = keyCodeMap[backward];
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}
			if(oculusControl.y > 0.13)
			{
				$('#checkCoord').text("turning forwad ");
				
				var currkey = keyCodeMap[forward];
                this.moving = Keymap[currkey].action;
                    if (typeof(keys[currkey])=='undefined' || keys[currkey]===null) {
						$('#checkCoord2').text("srsly");
                        keys[currkey] = PILOT_ACCELERATION;
                    }
			}
			else
			{
				var currkey = keyCodeMap[forward];
				if (Keymap[currkey] != null) 
				{
					// Delete the key from the tracking array
					
					delete keys[currkey];

					// Send a command to set the motion in this direction to zero
					if (Object.keys(keys).length > 0) {
					  var cmd = Keymap[currkey];
					  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
						  action : cmd.action,
						  speed : 0
					  });
					} else { // hovering state if no more active commands
					  this.cockpit.socket.emit("/pilot/drone", {
						  action : 'stop'
					  });
					}
                }
			}
			
			
		}

		  diffAngles = function(a, b) {
			a += 3 * Math.PI;
			b += 3 * Math.PI;
			return a - b;
		  };

        /*
         * Register keyboard event listener
         */
        Pilot.prototype.listen = function listen() {
                var pilot = this;
                $(document).keydown(function(ev) {
                        pilot.keyDown(ev);
                });

                $(document).keyup(function(ev) {
                        pilot.keyUp(ev);
                });

                $('#calibratemagneto').click(function(ev) {
                  ev.preventDefault();
                  pilot.calibrate(0);
                });
                $('#ftrim').click(function(ev) {
                  ev.preventDefault();
                  pilot.ftrim();
                });
                this.cockpit.socket.on('hovering', function() {
                  $('#calibratemagneto').prop('disabled', false);
                  $('#ftrim').prop('disabled', true);
                });
                this.cockpit.socket.on('landed', function() {
                  $('#calibratemagneto').prop('disabled', true);
                  $('#ftrim').prop('disabled', false);
                });
        };
		


        /*
         * Process onkeydown. For motion commands, we just update the
         * speed for the given key and the actual commands will be sent
         * by the sendCommand method, triggered by a timer.
         *
         */
        Pilot.prototype.keyDown = function keyDown(ev) {
                console.log("Keydown: " + ev.keyCode);
                if (ev.keyCode == 9) {
                  PILOT_ACCELERATION = (PILOT_ACCELERATION == 0.04) ? 0.64 : 0.04;
                  console.log("PILOT_ACCELERATION: " + PILOT_ACCELERATION);
                  ev.preventDefault();
                  return;
                }
                if (Keymap[ev.keyCode] == null) {
                        return;
                }
                ev.preventDefault();

                var key = ev.keyCode;
                var cmd = Keymap[key];
                //if flip, determine which direction to flip
                var regFlip = /^flip/;
                if (regFlip.test(cmd.action)) {
                  console.log("FLIP!");
                  //check for which direction to flip
                  switch (this.moving) {
                    case 'front':
                      cmd.action = 'flipAhead';
                      break;
                    case 'back':
                      cmd.action = 'flipBehind';
                      break;
                    case 'right':
                      cmd.action = 'flipRight';
                      break;
                    default:
                      cmd.action = 'flipLeft';
                      break;
                  }

                }
                // If a motion command, we just update the speed
                if (cmd.ev == "move") {
                    this.moving = Keymap[ev.keyCode].action;
                    if (typeof(keys[key])=='undefined' || keys[key]===null) {
                        keys[key] = PILOT_ACCELERATION;
                    }
                }
                // Else we send the command immediately
                else {
                    this.cockpit.socket.emit("/pilot/" + cmd.ev, {
                        action : cmd.action
                    });
                }
        };

        /*
         * On keyup we delete active keys from the key array
         * and send a stop command for this direction
         */
        Pilot.prototype.keyUp = function keyUp(ev) {
                console.log("Keyup: " + ev.keyCode);
                if (Keymap[ev.keyCode] == null) {
                        return;
                }
                ev.preventDefault();

                // Delete the key from the tracking array
                var key = ev.keyCode;
                delete keys[key];

                // Send a command to set the motion in this direction to zero
                if (Object.keys(keys).length > 0) {
                  var cmd = Keymap[key];
                  this.cockpit.socket.emit("/pilot/" + cmd.ev, {
                      action : cmd.action,
                      speed : 0
                  });
                } else { // hovering state if no more active commands
                  this.cockpit.socket.emit("/pilot/drone", {
                      action : 'stop'
                  });
                }
        }

        /*
         * Triggered by a timer, check for active keys
         * and send the appropriate motion commands
         */
        Pilot.prototype.sendCommands = function() {
                for (var k in keys) {
                    var cmd = Keymap[k];
                    // Send the command
                    this.cockpit.socket.emit("/pilot/" + cmd.ev, {
                        action : cmd.action,
                        speed : keys[k]
                    });

                    // Update the speed
                    keys[k] = keys[k] + PILOT_ACCELERATION/ (1 - keys[k]);
                    keys[k] = Math.min(.7, keys[k]);
                }
        }

        /*
         * Requets a device callibration. Beware that for some device
         * such as the compass, the drone will perform some motion.
         */
        Pilot.prototype.calibrate = function calibrate(deviceNum) {
                this.cockpit.socket.emit("/pilot/calibrate", {
                        device_num : 0
                });
        };

        /*
         * Requests a flat trim. Disabled when flying.
         */
        Pilot.prototype.ftrim = function ftrim() {
                this.cockpit.socket.emit("/pilot/ftrim");
        };


        window.Cockpit.plugins.push(Pilot);

}(window, document, jQuery));