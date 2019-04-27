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
app.controller('MainController', ['$scope', '$rootScope', '$socket', '$location', function($scope, $rootScope, $socket, $location) {

  $rootScope.dialog = {
		enabled: false,
		title: '',
		body: ''
	};

  $rootScope.friends = false;
  $rootScope.inventory = false;

  $rootScope.roomId = false; // the current roomid occupied by client user.
  $rootScope.previousRoomId = false; // when loading controller room.js, sets this to current roomId.

  $rootScope.friendList = {
    enabled: false,
    open: "friends"
  };

  $rootScope.inventoryWindow = {
    enabled: false
  };

  $rootScope.refreshFriends = function(ondone = false) {
    $.getJSON(`http://${clientVars.host}:7777/api/friends/${clientVars.sso}`, function(data){
      console.log("friends: ", data);
      $rootScope.friends = data;
      $rootScope.$apply();
      if (ondone !== false) {
        ondone();
      }
    });
  };
  $rootScope.refreshFriends();

  $rootScope.refreshInventory = function(ondone = false) {
    $.getJSON(`http://${clientVars.host}:7777/api/inventory/${clientVars.sso}`, function(data){
      console.log("inventory: ", data);
      $rootScope.inventory = data.inventory;
      $rootScope.$apply();
      if (ondone !== false) {
        ondone();
      }
    });
  }
  $rootScope.refreshInventory();

  $rootScope.profileLoad = function(profileid) {
    if (!isNaN(profileid)) {
      $rootScope.refreshFriends(function(){
          // Pulling backend data...
          $.getJSON(`http://${clientVars.host}:7777/api/profile/${profileid}`, function(profileData){
            if (profileData.error === true) {

            }
            else {
              $rootScope.profileViewWindow.enabled = true;
              $rootScope.profileViewWindow.data = profileData;
              $rootScope.$apply();
              $('.profile-dialog').css({
                "z-index": zipush
              });
              zipush += 1;
            }
          });
      });
    }
  }

  /*
   * sending over friend requests from the SSO-based userid to the
   * current viewing id.
   */
  $rootScope.sendFriendRequest = function() {
    if (!isNaN($rootScope.profileViewWindow.data.id)) {
      console.log("Going to send f/r");
      $.post(`http://${clientVars.host}:7777/api/addFriend`, {
        sso: clientVars.sso,
        friendID: $rootScope.profileViewWindow.data.id
      }, function(data){
        if (data.hasdata) {
          // already set as a friend, pending or not...
          // give them some space bruh
          $rootScope.dialog = {
            enabled: true,
            title: "Already sent them a request",
            body: "Give it some time! Maybe they need some space..."
          }
          pushSmallDialog();
          $rootScope.$apply();
          console.log("already a friend OR f/r is pending");
        }
        else {
          // alert(data);
          console.log(data);
          $('.friend').html("<strong>Friend request sent!</strong>");
        }
      });
    }
    else console.log("No profile window ID provided in scope.");
  };

  /*
   * handles the opening of the friends list,
   * quickly does a get request to refresh the friend
   * data before.
   */
  $rootScope.friendsListHandler = function() {
    if ($rootScope.friendList.enabled === true) {
      $rootScope.friendList.enabled = !$rootScope.friendList.enabled;
      // $rootScope.$apply();
    }
    else {
      $rootScope.refreshFriends(function(){
        $rootScope.friendList.enabled = !$rootScope.friendList.enabled;
        $rootScope.$apply();
      });
    }
  };

  $rootScope.changeFriendsListTab = function(to) {
    $rootScope.refreshFriends(function(){
      $rootScope.friendList.open = to;
      $rootScope.$apply();
    });
  }

  $scope.fl_removeFriend = function(theirid) {
    console.log(theirid);
    if (isNaN(theirid)) return false;
    $.post(`http://${clientVars.host}:7777/api/removeFriend`, {
      sso: clientVars.sso,
      friendID: theirid
    }, function(data){
      console.log("did..");
      if (data.success === true) {
        $('#friendid-'+theirid).parent().fadeOut(500, function(){
          $(this).remove();
        });
      }
    });
  }

  $scope.fl_acceptfriend = function(theirid) {
    console.log(theirid);
    if (isNaN(theirid)) return false;
    $.post(`http://${clientVars.host}:7777/api/acceptPending`, {
      sso: clientVars.sso,
      friendID: theirid
    }, function(data){
      console.log("did..");
      if (data.success === true) {
        $('#friendid-'+theirid).parent().fadeOut(500, function(){
          $(this).remove();
        });
      }
    });
  }

  /*
   * deleting friends from the unfriend link from SSO-based userid
   * to the current viewing id.
   */
  $rootScope.removeFriendship = function() {
    if (!isNaN($rootScope.profileViewWindow.data.id)) {
      console.log("Going to remove f/r");
      $.post(`http://${clientVars.host}:7777/api/removeFriend`, {
        sso: clientVars.sso,
        friendID: $rootScope.profileViewWindow.data.id
      }, function(data){
        if (data.hasdata === false) {
          // already set as a friend, pending or not...
          // give them some space bruh
          $rootScope.dialog = {
            enabled: true,
            title: "User is not your friend",
            body: "Sad times..."
          }
          pushSmallDialog();
          $rootScope.$apply();
          console.log("friend did not exist in row OR f/r is pending");
        }
        else {
          // alert(data);
          console.log(data);
          $('.unfriend').html("<strong>Friend deleted.</strong>");
        }
      });
    }
    else console.log("No profile window ID provided in scope.");
  }


  $rootScope.isFriend = function(){
    var inside = false;
    for (clientFriendsID in $rootScope.friends.friendIds) {
      if ($rootScope.friends.friendIds[clientFriendsID] == $rootScope.profileViewWindow.data.id) inside = true;
    }
    return inside;
  }

  $rootScope.isYou = function(){
    // console.log($rootScope.friends.clientID);
    // console.log($rootScope.profileViewWindow.data.id);
    if ($rootScope.friends.clientID == $rootScope.profileViewWindow.data.id)
      return true;
    else return false;
  }

	$rootScope.hcWindow = {
		enabled: false
	};

  $rootScope.profileViewWindow = {
    enabled: false,
    data: {}
  };

	$rootScope.superfluousBarItems = true;

	$rootScope.superfluousFriendBarItems = true;

	$socket.on('more credits', function() {
		var audio = new Audio('assets/sounds/cashRegister.mp3');
		audio.play();
	});

	$scope.toggleSuperfluousBarItems = function() {
		$rootScope.superfluousBarItems = $rootScope.superfluousBarItems ? false : true;
	};

	$scope.toggleSuperfluousFriendBarItems = function() {
		$rootScope.superfluousFriendBarItems = $rootScope.superfluousFriendBarItems ? false : true;
	};

	$scope.logout = function() {
		close();
	};

	$scope.enterRoom = function() {
		if(!$rootScope.isInRoom) {
			$location.path('/room');
		};
	};

	$scope.leaveRoom = function() {
		if($rootScope.isInRoom) {
			$socket.emit('user leave');
			$socket.off('load all users');
			$socket.off('user join');
			$socket.off('render room');
			$socket.off('remove user');
			$socket.off('user chat bubble');
			$socket.off('user typing bubble');
			$socket.off('user stopped typing');
			$socket.off('user move');
			$rootScope.isInRoom = false;
			$location.path('/view');
		};
	};

  // Socket emmission for dialog handling in general
	$socket.on('dialog', function(data) {
		$rootScope.dialog.enabled = true;
		$rootScope.dialog.title = data.title;
		$rootScope.dialog.body = data.body;
	});

  // Profile view handling
  // $socket.on('signin-dialog', function(data){
    // console.log("Going to throw up the signin dialog!")
    // $rootScope.signinDialog.enabled = data.enabled;
		// $rootScope.dialog.title = data.title;
		// $rootScope.dialog.body = data.body;
  // });

	$scope.buyHabboClub = function() {
		$rootScope.dialog.enabled = true;
		$rootScope.dialog.title = 'Feature not implemented yet';
		$rootScope.dialog.body = 'This feature is still not here!';
	};
	$scope.featureNotImplemented = function() {
		$rootScope.dialog.enabled = true;
		$rootScope.dialog.title = 'Feature not implemented yet';
		$rootScope.dialog.body = 'This feature is still not here!';
	};
	$socket.on('client error', function(data) {
		alert(data.response);
	});
	$socket.on('disconnect', function() {
		$location.path('/');
		console.log('User disconnected.');
	});
	$rootScope.clientCount = 0;
	$socket.on('client count update', function(data) {
		$rootScope.clientCount = data.response;
	});
}]);
