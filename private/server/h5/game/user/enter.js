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



 //BACKEND
module.exports = function(environment, frontend) {
	// console.log("FIRST");
	// console.log(c);
	// console.log("SECOND");
	// console.log(a);

	// environment.pool.getConnection(function(d, database){
	// 	console.log("the connction has workewd")
	//
	// });

	frontend.on("load room", function(data) {

    rooms = {
      "1": {

        "base": [
          [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    			[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        "furni": [
					//f: name, base location in room
					"green_grass:1,1"
				]

      }
    }

    roomId = data["roomId"]

    data.roomData = {}
    data.roomData.originalBase = rooms[roomId]["base"]
    data.roomData.matrix = rooms[roomId]["base"] // to stop deprecation
    data.roomData.shorthandFurni = rooms[roomId]["furni"]

		/*
		 * 1. convert shorthand into data
		 * 2. combine base + longhand data to remove spaces
		 * 3. sending forward to get parsed and furniture added
		 */

		//# Converting shorthand (green_grass:1,1) -> appropriate scheme for placing furniture
		environment.game.furni.expandShorthand(environment, rooms[roomId]["furni"])
			.then((longhand => {
				data.roomData.longhandFurni = longhand
			}))
			.then(function(){
				//# Combining the longhand + originalBase to get a wholistic app view
				data.roomData.base = data.roomData.originalBase;
				environment.game.furni.floorplanMerge(environment, data.roomData.base, data.roomData.longhandFurni);

			})
			.then(function(){
				environment.event.emit("load room", frontend, data);
			})
	});
};
