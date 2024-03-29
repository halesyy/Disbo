/**
 * Habbo API
 *
 * Based upon original code by:
 *
 * Copyright (c) 2014 Kedi Agbogre (me@kediagbogre.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
app.controller('SplashScreenController', ['$scope', '$rootScope', '$location', '$socket', function($scope, $rootScope, $location, $socket) {

  console.log($location.path());
	console.log($rootScope.wantsToGoTo);

  $rootScope.isBootstrapped = false;
	$rootScope.isInRoom = false;
	$scope.loadingState = '0%';
	$socket.emit('client connection', clientVars);
	$socket.on('change loading state', function(data) {
		$scope.loadingState = data.response + '%';
	});
	$socket.on('client view', function(data) {
		if (data.response == true) {
			$rootScope.userinfo = data.userinfo;
      // now done, checking if there's a redirect to go to a
      // specified room.
			$rootScope.isBootstrapped = true;


      if ($rootScope.isBootstrapped && $rootScope.hasOwnProperty('wantsToGoTo') && !isNaN($rootScope.wantsToGoTo)) {
        $location.path('/view');
      }
      else {
        $location.path('/view');
      }
		}
    else {
      console.log("Client view failed...");
    }
	});
}]);
