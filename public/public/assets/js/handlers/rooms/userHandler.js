
class ColourManager {



	 constructor($image, colour, sizearray) {
		 this.$image = $image;
		 this.image  = $image[0];
		 this.canvas = document.createElement("canvas");
		 this.ctx    = null;
		 this.originalPixels = null;
		 this.currentPixels  = null;
		 const th = this;
		 const size = sizearray;
		 const clr = colour;
		 const loadwait = $image.load(function(){
			 th.apply(clr, sizearray);
			 loadwait.off();
		 })
	 }

	 // applying using the #colour
	 apply(colour, size) {
		 this.loadPixels();
		 // 333333 -> 515151
		 this.replaceColour("#858585", colour);
		 this.applyToImage(this.canvas.toDataURL("image/png"));
		 this.resize(size);
	 }

	 loadPixels() {
		 this.canvas.width = this.image.width;
		 this.canvas.height = this.image.height;

 		 this.ctx = this.canvas.getContext("2d");
		 this.ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight, 0, 0, this.image.width, this.image.height);
		 this.originalPixels = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
		 this.currentPixels = this.ctx.getImageData(0, 0, this.image.width, this.image.height);

		 this.image.onload = null;
	 }

	 replaceColour(search, replace) {

		 // this.getPixels(img);
		 if (!this.originalPixels) return; // Check if image has loaded

		 var searchColour  = this.hexToRGB(search);
		 var replaceColour = this.hexToRGB(replace);

		 // console.log(searchColour);
		 // console.log(replaceColour);

		 for (var I = 0, L = this.originalPixels.data.length; I < L; I += 4)
		 {
		 		if (this.currentPixels.data[I + 3] > 0)
		 		{
					console.log(`${this.currentPixels.data[I]}${this.currentPixels.data[I+1]}${this.currentPixels.data[I+2]}`);
		 				if (`#${this.currentPixels.data[I]}${this.currentPixels.data[I+1]}${this.currentPixels.data[I+2]}` == search) {
							console.log("time to replace");
							this.currentPixels.data[I] = replaceColour.R;
							this.currentPixels.data[I + 1] = replaceColour.G;
							this.currentPixels.data[I + 2] = replaceColour.B;
		 				}
		 		}
		 }

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


//FONTEND
app.service("userHandler", ["$rootScope", "$socket", function(f, g) {
	return {

		calculateTile: function(a) {
			a = document.elementFromPoint(a.pageX, a.pageY);
			return !$(a).hasClass("inner") || $(a).parent().hasClass("empty") || $(a).parent().hasClass("wall-left") || $(a).parent().hasClass("wall-right") ? null : a;
		},

		move: function(a) {
			for (var d in a.steps) {
				(function(b) {

					window.setTimeout(function() {
						var c = $("[data-x=" + a.steps[b][0] + "][data-y=" + a.steps[b][1] + "]"),
							d = parseInt($(c).css("bottom"))+20,
							c = parseInt($(c).css("left"));
						$("[id=user" + a.id + "]").css({
							bottom: d + "px",
							left: (c+10) + "px"
						});
          // Speed, 100 = default, 300 = normal habbo-like speed
        }, 300 * b);
				})(d);

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
				"bottom": (b+20) + "px",
				"left": (c+10) + "px",
				// "background-image": "url(https://www.habbo.com.tr/habbo-imaging/avatarimage?figure=" + a.figure + "&size=n&direction=2&head_direction=2&crr=3&gesture=sml&size=n&direction=2&head_direction=2&crr=3&gesture=sml)",
        "transition": "all 0.3s linear 0s"
			});

			$Face = $("<img src='https://scontent.fbne3-1.fna.fbcdn.net/v/t1.0-9/50519253_388564998618786_1711903668455866368_n.jpg?_nc_cat=104&_nc_ht=scontent.fbne3-1.fna&oh=427bd5d96b7e93e586507d89aaf34fef&oe=5D695569' />");
			$Whole = $("<img src='assets/av/whole/1.png'>");
			// $Legs = $("<img src='assets/av/legs/1.png'>");
			// $Feet = $("<img src='assets/av/feet/shoe.png'>");
			// $Hat.width(40).css({
			// 	'margin-bottom': '-33px',
			// 	'z-index': 3,
			// 	'position': 'relative'
			// });
			// $Face.width(40).css({
			// 	'z-index': 2,
			// 	'position': 'relative'
			// });
			// $Legs.width(40).css({
			// 	'margin-bottom': '-15px',
			// 	'z-index': 2,
			// 	'position': 'relative'
			// });
			// $Feet.css({
			// 	'z-index': 1,
			// 	'position': 'relative'
			// });
			$Face.width(40).css({
				'margin-bottom': '-65px',
				'z-index': 2,
				'position': 'relative',
				'border-radius': '20px',
			});
			$Whole.css({
				'z-index': 1,
				'position': 'relative'
			});
			new ColourManager($Whole, "#ffffff", [40, "ig"]);
			// new ColourManager($Feet, "#ff4500", [40, "ig"]);
			// $()

			$AvatarContainer.append([$Face, $Whole]);
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
			$chatMessage.innerHTML = `<p><span>${username}: </span>${message}</p>`

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
			setInterval(function() {
				$($chatBubble).css({
					top: parseInt($($chatBubble).css("top")) - 30 + "px",
				});
			}, 2000);
		}
	};
}]);
