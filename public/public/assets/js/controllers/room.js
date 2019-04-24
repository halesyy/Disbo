
// THIS IS A FRONTEND FILE

app.controller('RoomController', ['$routeParams', '$scope', '$socket', '$location', '$rootScope', 'userHandler', 'roomHandler',
	function($routeParams, $scope, $socket, $location, $rootScope, userHandler, roomHandler) {
		if (!$rootScope.isBootstrapped) {
			$location.path('/');

		} else {
			var roomId = $routeParams.roomId;
			if (isNaN(roomId)) $location.path('/')

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
          // push to backend to render the profile data
          // Pulling backend data...
          // alert(`${clientVars.host}:7777/api/profile/${userid}`);
          $.getJSON(`http://${clientVars.host}:7777/api/profile/${userid}`, function(profileData){
            if (profileData.error === true) {

            }
            else {
              $rootScope.profileViewWindow.enabled = true;
              $rootScope.profileViewWindow.data = profileData;
              $rootScope.$apply();
            }
          });
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
        userHandler.inject(userdata);
			});

			$socket.on('user chat bubble', function(message, username, position) {
				userHandler.chatBubble(message, username, position);
        // console.log(`[XX:XX:XX] ${username}: "${message}"`);
			});

			$socket.on('remove user', function(userData) {
				userHandler.remove(userData)
			});

			$socket.on('load all users', function(allUsers) {
        // console.log("load all users:");
        // console.log(allUsers);
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
