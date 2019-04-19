
app.controller('HotelViewController', ['$scope', '$socket', '$location', '$rootScope', function($scope, $socket, $location, $rootScope) {
	if (!$rootScope.isBootstrapped) {
		$location.path('/');
	};
	$socket.emit('client view rendered');
	$socket.on('update userinfo', function(data) {
		$rootScope.userinfo = data;
	});
}]);
