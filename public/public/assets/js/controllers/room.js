
// THIS IS A FRONTEND FILE

app.controller('RoomController', ['$routeParams', '$scope', '$socket', '$location', '$rootScope', 'userHandler', 'roomHandler',
	function($routeParams, $scope, $socket, $location, $rootScope, userHandler, roomHandler) {
		console.log($location.path());


		if (!$rootScope.isBootstrapped) { // ignoring this for now, to allow the user to go straight into rooms
			$rootScope.wantsToGoTo = $routeParams.roomId;
			console.log($rootScope.wantsToGoTo);
			$location.path('/view');
		} else {

			// $rootScope.$watch(function(){
			//     return $location.path();
			// }, function(value){
			//     console.log(value);
			// }


			$rootScope.wantsToGoTo = false;
			console.log("Rendering room from Room Controller.");

			if ($rootScope.roomId !== false) {
				console.log("Room id is set, you must be moving rooms!");

				$rootScope.previousRoomId = $rootScope.roomId;
				$rootScope.roomId = $routeParams.roomId;

				// When entering, set to allow a clean slate and
				// the click "effect" when entering a room from the
				// finder. defaulting false.
				$rootScope.finder.enabled = false;

				// Going to make sure that they are removed from their
				// previous room just incase.
				console.log("Just asked to leave "+$rootScope.previousRoomId);
				$socket.emit('user leave room id', $rootScope.previousRoomId);

				$socket.off('load all users'); $socket.off('user join'); $socket.off('render room'); $socket.off('remove user'); $socket.off('user chat bubble'); $socket.off('user typing bubble'); $socket.off('user stopped typing'); $socket.off('user move');
			}

			/*
			 * all the inventory window and current selected furniture code.
			 */


			/*
			 * deleting of furniture that is yours, when
			 * hitting "ctrl" to open up the ability to click
			 * on furniture over the tiles, then to
			 * affect when clicking on the actual furniture.
			 */
			const ctrlStart = $(window).keydown(function(event){
				// console.log(event);
				// console.log(event.metaKey);
				if (event.ctrlKey || event.metaKey) {
					// console.log("ctrl down...");
					// MAKE FURNI CLICKABLE
					$('.furni').removeClass("unclickable");
					$('.furni').addClass("ctrl-watch-for-click");
					$('#map #map-tiles').addClass("unclickable");
				}
			});
			$(window).keyup("ctrl", function(event){
				// console.log("ctrl up...");
				// MAKE FURNI NON-CLICKABLE
					$('.furni').addClass("unclickable");
					$('.furni').removeClass("ctrl-watch-for-click");
					$('#map #map-tiles').removeClass("unclickable");
			});
			$(window).keyup("meta", function(event){
				// console.log("ctrl up...");
				// MAKE FURNI NON-CLICKABLE
					$('.furni').addClass("unclickable");
					$('.furni').removeClass("ctrl-watch-for-click");
					$('#map #map-tiles').removeClass("unclickable");
			});
			// Waiting for a "remove furni fid" emit
			// to ask to remove furniture.
			$socket.on("remove furni from id", function(fid){
				$(`[data-fid="${fid}"]`).remove();
			});


			/*
			 * Wholistic inventory and furniture placement
			 * management, a very large collection of intricate code.
			 */
			$rootScope.placeFurni = function(furnitureItem) {

					console.log("Toggling furni placing on.");
					$furnioverlay = $('#furni-hover-overlay');
					$furnioverlay.attr('src', `/assets/furni/${furnitureItem.iconloc}`);
					$rootScope.currentSelectedFurni = furnitureItem;
					$rootScope.inventoryWindow.enabled = false;

					$rootScope.tileWatchHover = $('#map .tile .inner').hover(function(){
						if (!$(this).parent().hasClass("empty"))
							$(this).css("background-image", `url('/assets/images/sprites/floor.png')`);
						var tileBottom = parseInt($(this).parent().css("bottom")) + 9 + furnitureItem.bottomAdjust;
						$furnioverlay.parent().css("bottom", `${tileBottom}px`);
						$furnioverlay.parent().css("left", $(this).parent().css("left"));
						$rootScope.currentTileX = $(this).attr('data-x');
						$rootScope.currentTileY = $(this).attr('data-y');
						$furnioverlay.css({"display": "block"});
					});

					$rootScope.tileWatchOffhover = $('#map .tile .inner').mouseout(function(){
						$(this).removeProp("background-image");
					});

					$rootScope.tileWaitForClick = $(document).on("click", ".inner", function(event){
						var x_loc = $(this).parent().attr("data-x");
						var y_loc = $(this).parent().attr("data-y");
						fe_collection = $rootScope.currentSelectedFurni;
						fe_collection.sso = clientVars.sso;
						fe_collection.roomID = $rootScope.roomId;
						fe_collection.root = [x_loc, y_loc];
						$socket.emit("verify furniture place", fe_collection, function(response){
							console.log(response);
						});
					});

					$rootScope.waitForOutsideClick = $(document).on("click", function(event){
						$this = $(event.target);
						// console.log($this);
						if (!$this.hasClass("inner") && !$this.hasClass('furni-container-bg')) {
							$rootScope.stopPlacingFurni();
							$rootScope.waitForOutsideClick.off();
						}
					});

			}

			$rootScope.stopPlacingFurni = function(reopenWindow = true) {
				console.log("Toggling furni placing off.");
				$rootScope.inventoryWindow.enabled = reopenWindow;
				$furnioverlay = $('#furni-hover-overlay');
				$furnioverlay.css({
					"display": "none"
				});
				$rootScope.tileWatchHover.off();
				$rootScope.inventoryWindow.furniOverlayEnabled = false;
				$rootScope.tileWatchOffhover.off();
				$rootScope.tileWaitForClick.off();
				$rootScope.$apply();
			}


			const roomId = $routeParams.roomId;
			$rootScope.roomId = roomId;
			if (isNaN(roomId)) $location.path('/');

			// Turning off potentially old sockets.
			console.log("Sending request to load room " + roomId);
			if (roomId && !isNaN(roomId)) {
				$socket.emit('load room', {
					roomId: roomId.toString()
				});
			}

			$rootScope.isInRoom = true;
			$scope.chatMessage = '';
			$socket.on('render room', function(data) {
				/*
				 * base data for floorplan
				 */
        base  = data.base; // the floor plan
				/*
				 * shorthand furniture data
				 */
				furni = data.longhandFurni;
				// name  = data.name;
				$rootScope.roomName = data.name;
        roomHandler.generateModel(base);
				roomHandler.generateFurniture(data.longhandFurni, $socket);
			});

			$socket.on("new furni placed", function(data){
				roomHandler.generateFurniture(data, $socket);
			});

			$('#map').click(function(event) {
				var innerTile = userHandler.calculateTile(event);
				if (innerTile != null && !window.moving) {
					var coordinates = innerTile.innerHTML;
					var c = coordinates.split(':');
					$socket.emit('verify movement', {
						finalCoordinates: {
							x: parseInt(c[0]),
							y: parseInt(c[1])
						}
					});
				};
			});

      /*
       * Handling another user being clicked, and bringing up
       * the appropriate view for the user.
       */
      $(document).on('click', '.avatar', function(event){
        let userid = parseInt($(this).attr('id').replace('user', ''));
        if (!isNaN(userid)) {
					$rootScope.profileLoad(userid);
        }
      });

			$('#chat-input').keyup(function(e) {
				!this.value ? $socket.emit('user stopped typing') : $socket.emit('user typing');
			});

			$scope.sendChatMessage = function() {
				$socket.emit('user chat', $scope.chatMessage);
				$scope.chatMessage = null;
			};

			$socket.on('user join', function(data) {
        userdata = data;
        console.log(userdata);
        userHandler.inject(userdata);
			});

			$socket.on('user chat bubble', function(message, username, userid, position, avatar) {
				userHandler.chatBubble(message, username, userid, position, avatar);
        console.log(`[XX:XX:XX] ${username}: "${message}"`);
			});

			$socket.on('remove user', function(userData) {
				userHandler.remove(userData)
			});

			$socket.on('load all users', function(allUsers) {
				for (var user in allUsers) {
					userHandler.inject(allUsers[user]);
				};
			});

			$socket.on('user typing bubble', function(userid) {
				$('#user' + userid + ' > .typing').remove();
				$('#user' + userid).prepend('<img class="typing" style="float:right" src="assets/images/hotelview/userIcons/typing.png">');
			});

			$socket.on('user stopped typing', function(userid) {
				$('#user' + userid + ' > .typing').remove();
			});

			$socket.on('user move', function(data) {
				userHandler.move(data);
			});
		}
	}
]);
