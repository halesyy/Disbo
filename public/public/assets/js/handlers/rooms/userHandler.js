

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
							d = parseInt($(c).css("top")) - 80,
							c = $(c).css("left");
						$("[id=user" + a.id + "]").css({
							top: d + "px",
							left: c
						});
          // Speed, 100 = default, 300 = normal habbo-like speed
        }, 300 * b);
				})(d);

			}
		},

		inject: function(a) {
			var d = $('<div class="avatar"></div>'),
				b = a.currentPosition.split(":"),
				c = $("[data-x=" + b[0] + "][data-y=" + b[1] + "]"),
				b = parseInt($(c).css("top")) - 80,
				c = $(c).css("left");
			$(d).attr("id", "user" + a.id);
			$(d).css({
				"top": b + "px",
				"left": c,
				"background-image": "url(https://www.habbo.com.tr/habbo-imaging/avatarimage?figure=" + a.figure + "&size=n&direction=2&head_direction=2&crr=3&gesture=sml&size=n&direction=2&head_direction=2&crr=3&gesture=sml)",
        "transition": "all 0.3s linear 0s"
			});
			$("#map #map-users").append(d);
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
			setInterval(function() {
				$($chatBubble).css({
					top: parseInt($($chatBubble).css("top")) - 30 + "px",
				});
			}, 2000);
		}
	};
}]);
