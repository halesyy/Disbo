
app.controller('HotelViewController', ['$scope', '$socket', '$location', '$rootScope', function($scope, $socket, $location, $rootScope) {
	console.log($location.path());
	console.log($rootScope.wantsToGoTo);

	if (!$rootScope.isBootstrapped) {
		$location.path('/');
	}
	else {
		if ($rootScope.isBootstrapped && $rootScope.hasOwnProperty('wantsToGoTo') && !isNaN($rootScope.wantsToGoTo)) {
			$location.path('/room/'+$rootScope.wantsToGoTo);
		}
	}

	$socket.emit('client view rendered');
	console.log("View model rendered.");
	// console.log("prev room id: "+$rootScope.previousRoomId);
	// console.log("current room id: "+$rootScope.roomId);

	if ($rootScope.previousRoomId !== false && !isNaN($rootScope.previousRoomId)) {
		$socket.emit("user leave room id", $rootScope.previousRoomId);
	}

	if ($rootScope.roomId !== false && !isNaN($rootScope.roomId)) {
		$socket.emit("user leave room id", $rootScope.roomId);
		// console.log("Made user leave the room" + $rootScope.roomId);
	}



	$socket.on('update userinfo', function(data) {
		$rootScope.userinfo = data;
	});
}]);
