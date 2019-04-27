
// THIS IS A FRONTEND FILE

app.controller('RoomController', ['$routeParams', '$scope', '$socket', '$location', '$rootScope', 'userHandler', 'roomHandler',
	function($routeParams, $scope, $socket, $location, $rootScope, userHandler, roomHandler) {
		if (!$rootScope.isBootstrapped) {
			$location.path('/');

		} else {

			if ($rootScope.roomId !== false) {
				console.log("Room id is set, you must be moving rooms!");

				$rootScope.previousRoomId = $rootScope.roomId;
				$rootScope.roomId = $routeParams.roomId;

				// Going to make sure that they are removed from their
				// previous room just incase.
				console.log("Just asked to leave "+$rootScope.previousRoomId);
				$socket.emit('user leave room id', $rootScope.previousRoomId);
				// $socket.emit('join room id', $rootScope.roomId);

				$socket.off('load all users');
				$socket.off('user join');
				$socket.off('render room');
				$socket.off('remove user');
				$socket.off('user chat bubble');
				$socket.off('user typing bubble');
				$socket.off('user stopped typing');
				$socket.off('user move');
			}

		  $rootScope.inventoryWindow = {
		    enabled: false,
		    furniOverlayEnabled: false
		  };

			// INVENTORY MANAGEMENT...
			$rootScope.placeFurni = function(furnitureItem) {

					console.log("Toggling furni placing on.");
					// $rootScope.inventoryWindow.furniOverlayEnabled = true;
					$furnioverlay = $('#furni-hover-overlay');
					$furnioverlay.attr('src', `/assets/furni/${furnitureItem.iconloc}`);
					$rootScope.inventoryWindow.enabled = false;

					$rootScope.tileWatchHover = $('#map .tile .inner').hover(function(){
						// console.log(`url('${furnitureItem.iconloc}') !important`);
						$(this).css("background-image", `url('/assets/images/sprites/floor.png')`);
						var tileBottom = parseInt($(this).parent().css("bottom")) +9
						$furnioverlay.parent().css("bottom", `${tileBottom}px`);
						$furnioverlay.parent().css("left", $(this).parent().css("left"));
						$rootScope.currentTileX = $(this).attr('data-x');
						$rootScope.currentTileY = $(this).attr('data-y');
						$furnioverlay.css({
							"display": "block"
						});
					});

					$rootScope.tileWatchOffhover = $('#map .tile .inner').mouseout(function(){
						// console.log(`url('${furnitureItem.iconloc}') !important`);
						$(this).removeProp("background-image");
					});

					$rootScope.tileWaitForClick = $(document).on("click", ".inner", function(event){
						var x_loc = $(this).parent().attr("data-x");
						var y_loc = $(this).parent().attr("data-y");
						// making the socket connction, there will be a few responses and
						// all have to be accounted for.
						// success = yes, it went well. the client should have received
						// 			     a socket from the backend anyway telling it to place furni.
						// noMore  = worked but there is no more # of that furni, so stop
						// 					 being in furniture mode and open back up the thing.
						// verifyUnsuccessful = verify was unsuccessful, the furni doesnt
						// 		       exist for the user or it's a bad place, and a bunch of
						//					 other auth for the user. just stop it all and open the
						// 				   window.
						$socket.emit("kill myself");

						console.log(x_loc, y_loc);
					});

					$rootScope.waitForOutsideClick = $(document).on("click", function(event){
						$this = $(event.target);
						// console.log($this);
						if (!$this.hasClass("inner") && !$this.hasClass('furni-icon')) {
							$rootScope.stopPlacingFurni();
							$rootScope.waitForOutsideClick.off();
						}
					});

			}

			$rootScope.stopPlacingFurni = function() {
				console.log("Toggling furni placing off.");
				$furnioverlay = $('#furni-hover-overlay');
				$furnioverlay.css({
					"display": "none"
				});
				$rootScope.tileWatchHover.off();
				$rootScope.inventoryWindow.furniOverlayEnabled = false;
				// $('.floor > .inner').css({
				// 	"background-image": "url('/assets/images/sprites/floor.png')"
				// });
				$rootScope.tileWatchOffhover.off();
				$rootScope.tileWaitForClick.off();
				$rootScope.$apply();
			}


			const roomId = $routeParams.roomId;
			$rootScope.roomId = roomId;
			if (isNaN(roomId)) $location.path('/');

			// Turning off potentially old sockets.
			console.log("I just ran this! Loading room " + roomId);

			$socket.emit('load room', {
				roomId: roomId
			});

			$rootScope.isInRoom = true;
			$scope.chatMessage = '';
			$socket.on('render room', function(data) {
        // from server/game/user/enter.js

				/*
				 * base data for floorplan
				 */
        base  = data.base // the floor plan
				/*
				 * shorthand furniture data
				 */
				furni = data.longhandFurni

        roomHandler.generateModel(base);
				roomHandler.generateFurniture(data.longhandFurni);
			});

			$('#map').click(function(event) {
				var innerTile = userHandler.calculateTile(event);
				if (innerTile != null) {
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
       * handling another user being clicked, and bringing up
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
        // console.log("user join");
        // console.log(data);
				// $scope.injectUser(data);
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
        // console.log("load all users:");
        console.log(allUsers);
        // console.log(userHandler);
				for (var user in allUsers) {
					userHandler.inject(allUsers[user]);
				};
			});

			$socket.on('user typing bubble', function(userid) {
				$('#user' + userid).html('<img style="float:right" src="assets/images/hotelview/userIcons/typing.png">');
			});

			$socket.on('user stopped typing', function(userid) {
				$('#user' + userid).html('');
			});

			$socket.on('user move', function(data) {
				userHandler.move(data);
			});
		}
	}
]);
