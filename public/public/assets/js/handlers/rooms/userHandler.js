
class ColourManager {



	 constructor($image, colour, sizearray, name = "undefined", random=false) {
		 this.$image = $image;
		 this.image  = $image[0];
		 this.canvas = document.createElement("canvas");
		 this.ctx    = null;
		 this.originalPixels = null;
		 this.currentPixels  = null;
		 this.random = random;
		 this.name = name;
		 const th = this;
		 const size = sizearray;
		 const clr = colour;
		 const loadwait = $image.load(function(){
			 th.apply(clr, sizearray);
			 loadwait.off();
		 })
	 }

	 rgbToHex(rgb) {
		  var hex = Number(rgb).toString(16);
		  if (hex.length < 2) {
		       hex = "0" + hex;
		  }
		  return hex;
		}

		rgbConvert(r, g, b) {
			return `#${this.rgbToHex(r)}${this.rgbToHex(g)}${this.rgbToHex(b)}`;
		}

	 // applying using the #colour
	 apply(colour, size) {
		 this.loadPixels();
		 // FIRST lAYER, ACCOUNTING FOR ALL LEVELS OF ANTI-ALIAS.


		 this.replaceColour("#ff00ff", colour, true, this.random);
		 // this.replaceColour("#3f003f", colour);
		 // this.replaceColour("#7f007f", colour);
		 // this.replaceColour("#bf00bf", colour);
		 this.applyToImage(this.canvas.toDataURL("image/png"));
		 this.resize(size);
	 }

	 loadPixels() {
		 this.canvas.width = this.image.width;
		 this.canvas.height = this.image.height;

 		 this.ctx = this.canvas.getContext("2d");

		 this.ctx.webkitImageSmoothingEnabled = false;
		 this.ctx.mozImageSmoothingEnabled = false;
		 this.ctx.imageSmoothingEnabled = false;

		 this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight, 0, 0, this.image.width, this.image.height);
		 this.originalPixels = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
		 this.currentPixels = this.ctx.getImageData(0, 0, this.image.width, this.image.height);

		 this.image.onload = null;
	 }

	 replaceColour(search, replace, dynamic=false, random=false) {

		 // this.getPixels(img);
		 if (!this.originalPixels) return; // Check if image has loaded

		 var searchColour  = this.hexToRGB(search);
		 var replaceColour = this.hexToRGB(replace);
		 if (random) {
			 var replaceColour = {
				 R: Math.floor(Math.random()*255),
				 G: Math.floor(Math.random()*255),
				 B: Math.floor(Math.random()*255),
			 };
		 }


		 // console.log(searchColour);
		 // console.log(replaceColour);
		 const accountfor = {};
		 var ogpixel = this.currentPixels.data;
		 for (var I = 0, L = this.originalPixels.data.length; I < L; I += 4)
		 {
			 var forceReplace = false;
		 		if (this.currentPixels.data[I + 3] > 0)
		 		{
					let hex = this.rgbConvert(ogpixel[I], ogpixel[I+1], ogpixel[I+2]);
					if (dynamic) {
						// if G == '00'
						if (this.rgbToHex(this.currentPixels.data[I+1]) == '00' && hex != '#000000') {
							var Rref = 255 - ogpixel[I]; //#ff00ff
							var Bref = 255 - ogpixel[I+2];
							var TRef = (Rref + Bref) / 2;
							// console.log("going to dynamic!");
							// we know it needs to happen
							// we need to take the outerlayers (Rref, Bref)
							// compare it to ff x ff and
							// console.log(Rref, Bref);
							forceReplace = true;
						}
						else {
							var Rref = 0;
							var Bref = 0;
							var Tref = 0;
							forceReplace = false;
						}
					}

					if (hex in accountfor) accountfor[hex] += 1;
					else accountfor[hex] = 1;

					// console.log(hex, search);
	 				if (hex == search && !dynamic) {
						// console.log("Image replacement.");
						this.currentPixels.data[I] = replaceColour.R;
						this.currentPixels.data[I + 1] = replaceColour.G;
						this.currentPixels.data[I + 2] = replaceColour.B;
	 				}
					else if (forceReplace && dynamic) {
						// console.log("Image replacement dynamic.");
						this.currentPixels.data[I] = replaceColour.R - TRef;
						this.currentPixels.data[I + 1] = replaceColour.G - TRef;
						this.currentPixels.data[I + 2] = replaceColour.B - TRef;

					}
		 		}
		 }
		 console.log(this.name, accountfor);

		 this.ctx.putImageData(this.currentPixels, 0, 0);
		 // this.image.src = this.canvas.toDataURL("image/png");
	 }

	 applyToImage(data) {

		 this.$image.attr('src', data);
	 }

	 resize(sizearray) {
		 const w = sizearray[0];
		 const h = sizearray[1];
		 if (w != "ig") this.$image.width(w);
		 if (h != "ig") this.$image.height(h);
	 }

	 hexToRGB(Hex) {
		 var Long = parseInt(Hex.replace(/^#/, ""), 16);
		 return {
				 R: (Long >>> 16) & 0xff,
				 G: (Long >>> 8) & 0xff,
				 B: Long & 0xff
		 };
	 }
};









window.moving = false;


//FONTEND
app.service("userHandler", ["$rootScope", "$socket", function(f, g) {
	return {

		calculateTile: function(a) {
			a = document.elementFromPoint(a.pageX, a.pageY);
			return !$(a).hasClass("inner") || $(a).parent().hasClass("empty") || $(a).parent().hasClass("wall-left") || $(a).parent().hasClass("wall-right") ? null : a;
		},

		move: function(stepData) {
			if (window.moving) return;
			else window.moving = true;

			for (const stepx in stepData.steps) {
				window.setTimeout(function() {
						var $tile = $("[data-x=" + stepData.steps[stepx][0] + "][data-y=" + stepData.steps[stepx][1] + "]");
						var bottomAdjust = parseInt($tile.css("bottom"));
						var leftAdjust   = parseInt($tile.css("left"));
						$(`[id=user${stepData.id}]`).css({
							bottom: (bottomAdjust+10) + "px",
							left: (leftAdjust-2) + "px"
						});
						if (stepx == (stepData.length-1)) window.moving = false;
          // Speed, 100 = default, 300 = normal habbo-like speed
        }, 300 * stepx);

			}
		},

		inject: function(a) {
			var $AvatarContainer = $('<div class="avatar"></div>');
			var b = a.currentPosition.split(":");
			var $tile = $("[data-x=" + b[0] + "][data-y=" + b[1] + "]");

			var b = parseInt($tile.css("bottom"));
			var c = parseInt($tile.css("left"));

			$AvatarContainer.attr("id", "user" + a.id);
			$AvatarContainer.css({
				"bottom": (b+10) + "px",
				"left": (c-2) + "px",
				// "background-image": "url(https://www.habbo.com.tr/habbo-imaging/avatarimage?figure=" + a.figure + "&size=n&direction=2&head_direction=2&crr=3&gesture=sml&size=n&direction=2&head_direction=2&crr=3&gesture=sml)",
        "transition": "all 0.3s linear 0s"
			});

			const avwidth = "65px";

			$Whole = $("<img src='assets/av/whole/sbase.png'>");
			$Whole.css({'z-index': 1, 'position': 'absolute', 'bottom': 0, 'left': 0, "width": avwidth, "height": "auto", "display": "none"});
			$Whole.load(function(){ $(this).css({"display": "block"}); })

			$Hair = $("<img src='assets/av/hair/mohawk.png'>");
			$Hair.css({'z-index': 2, 'position': 'absolute', 'bottom': 0, 'left': 0, "width": avwidth, "height": "auto", "display": "none"});
			$Hair.load(function(){ $(this).css({"display": "block"}); })

			$Shirt = $("<img src='assets/av/torso/shirt.png'>");
			$Shirt.css({'z-index': 3, 'position': 'absolute', 'bottom': 0, 'left': 0, "width": avwidth, "height": "auto", "display": "none"});
			$Shirt.load(function(){ $(this).css({"display": "block"}); })

			$Legs = $("<img src='assets/av/legs/shorts.png'>");
			$Legs.css({'z-index': 3, 'position': 'absolute', 'bottom': 0, 'left': 0, "width": avwidth, "height": "auto", "display": "none"});
			$Legs.load(function(){ $(this).css({"display": "block"}); })

			new ColourManager($Whole, "#eac086", ["ig", "ig"], name="template", random=false);
			new ColourManager($Hair, "#2d2a2a", ["ig", "ig"], name="hair");
			new ColourManager($Shirt, "#c21f1f", ["ig", "ig"], name="shirt", random=true);
			new ColourManager($Legs, "#c21f1f", ["ig", "ig"], name="legs", random=true);

			$Stack = [$Whole, $Hair, $Shirt, $Legs];
			$AvatarContainer.append($Stack);
			$("#map #map-users").append($AvatarContainer);

		},

		remove: function(a) {
			$("#user" + a).remove();
		},
		//                      a      d                      b
		chatBubble: function(message, username, userid, position, avatar) {
			const $chatInput = document.getElementById('chat-input');
			$chatInput.disabled = true;
			setTimeout(function() {
				$chatInput.disabled = false;
				$chatInput.focus();
			}, 1500)
			const $chatBubblesContainer = document.getElementById('map-chat-bubbles')

	    const $chatBubble = document.createElement('div');
	    $chatBubble.classList.add('chatbubble')

			const $chatBubbleImg = document.createElement('img');
			$chatBubbleImg.src = `https://images.discordapp.net/avatars/${userid}/${avatar}.png?size=256`

			const $chatMessage = document.createElement('p');
			$chatMessage.innerHTML = `<p><span>${username}: </span> ${message}</p>`

			$chatBubble.appendChild($chatBubbleImg);
			$chatBubble.appendChild($chatMessage);
			$chatBubble.style.marginBottom = "100px";

			position = position.split(':');
			let dataPoints = $("[data-x=" + position[0] + "][data-y=" + position[1] + "]");
			position = parseInt($(dataPoints).css("top")) - 100;
			dataPoints = $(dataPoints).css("left");
			$($chatBubble).css({
				top: position + "px",
				left: dataPoints
			})
			$("#map #map-chat-bubbles").append($chatBubble);
			$('#user' + userid + ' > .typing').remove();
			setInterval(function() {
				$($chatBubble).css({
					top: parseInt($($chatBubble).css("top")) - 30 + "px",
				});
			}, 1500);
		}
	};
}]);
