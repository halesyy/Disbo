

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
				"background-position": "top",
				"background-size": "cover",
				// "background-image": "url('http://www.tootimid.com/assets/images/0268_00_bu_6.png')",
				// "background-image": "url('http://hopes-and-dreams.net/img/steveirwin2.gif')",

				"background-image": "url(https://www.habbo.com.tr/habbo-imaging/avatarimage?figure=" + a.figure + "&size=n&direction=2&head_direction=2&crr=3&gesture=sml&size=n&direction=2&head_direction=2&crr=3&gesture=sml)",
        "transition": "all 0.3s linear 0s"
			});
			$("#map #map-users").append(d);
		},

		remove: function(a) {
			$("#user" + a).remove();
		},

		chatBubble: function(a, d, b) {
			var c = $('<div class="chat-bubble"></div>');
			b = b.split(":");
			var e = $("[data-x=" + b[0] + "][data-y=" + b[1] + "]");
			b = parseInt($(e).css("top")) - 100;
			e = $(e).css("left");
			$(c).css({
				top: b + "px",
				left: e
			});
			$(c).html(d + ": " + a);
			$("#map #map-chat-bubbles").append(c);
			setInterval(function() {
				$(c).css({
					top: parseInt($(c).css("top")) - 30 + "px"
				});
			}, 2E3);
		}
	};
}]);
