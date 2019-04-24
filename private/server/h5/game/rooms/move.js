/**
 * Habbo HTML5
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

// BACKEND

var pathfinder = require("pathfinding");

module.exports = function(env, frontend, data) {
  // d = environment
  // e = frontend
  // a = data
  // console.log(data);
  // console.log(data);s

	frontend.on("verify movement", function(frontendData) {
    // b = frontendData
		c = environment.rooms[data.roomId].users[frontend.currentUser.id].currentPosition.split(":"),
		  	f = c[0],
			  g = c[1],
			  c = frontendData.finalCoordinates.x;
		    b = frontendData.finalCoordinates.y;

    var x1 = parseInt(f)
    var y1 = parseInt(g)
    var x2 = parseInt(c)
    var y2 = parseInt(b)

    var finalDestination = `${c}:${b}`;
    var initialPlacement = `${f}:${g}`;

		if (finalDestination != initialPlacement) {
      // "FG" is first place, where "GC" is the go-to
			var grid = new pathfinder.Grid(data.roomData.base);
			var path = new pathfinder.AStarFinder({
            // future room-specific variable
					  allowDiagonal: true
		  });

			for (userx in environment.rooms[data.roomId].users) {
        // console.log(d.rooms[a.roomId].users)
				var currentPosition = environment.rooms[data.roomId].users[userx].currentPosition.split(":");
				grid.setWalkableAt(currentPosition[0], currentPosition[1], false);
			}
      //f, g, c, b
			steps = path.findPath(x1, y1, x2, y2, grid.clone());
			environment.rooms[data.roomId].users[frontend.currentUser.id].currentPosition = finalDestination;
      // console.log(steps);
      console.log(`[XX:XX:XX] User ${environment.rooms[data.roomId].users[frontend.currentUser.id].username} moved from ${initialPlacement} to ${finalDestination} in room id ${data.roomId}`);

			environment.io.sockets["in"](data.roomId).emit("user move", {
				steps: steps,
				id: frontend.currentUser.id
			});
		}

	});
};
