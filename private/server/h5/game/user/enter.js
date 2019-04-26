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

        // "baseString": "c t t t t t t\ns 0 0 0 0 0 0\ns 0 0 0 0 0 0\ns 0 0 0 0 0 0\ns 0 0 0 0 0 0\nd 0 0 0 0 0 0\ns 0 0 0 0 0 0",
        "baseString": "c t t t t t t t t t t t t t t t\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\nd 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\ns 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
        "furni": [
					//f: name, base location in room
					"green_grass:1,1",

					"green_grass:3,1",
					"green_grass:1,3",
					"green_grass:3,3",

					"green_grass:5,1",
					"green_grass:1,5",
					"green_grass:5,5",
					"green_grass:3,5",
					"green_grass:5,3",

          "autistic_table:6,1",
          "autistic_table:6,2",
          "autistic_table:6,3",
          "autistic_table:6,4",
          "autistic_table:6,5",
          "autistic_table:1,6",
          "autistic_table:2,6",
          "autistic_table:3,6",
          "autistic_table:4,6",
          "autistic_table:6,6",
          // "autistic_table:6,5",
				]

      }
    }

		roomId = data["roomId"]

    data.roomData = {}
		data.roomId = roomId

		// Identifiers are the string-based variable changes in the room, such as d=door
    data.roomData.baseIdentifierArray = environment.game.rooms.converter.fromString(rooms[roomId]["baseString"]);
		data.roomData.baseIdentifierString = rooms[roomId]["baseString"];
		// The original, safe, only-numeric matrix/base as well as furnishorthands
		data.roomData.base   = environment.game.rooms.converter.toNumeric(rooms[roomId]["baseString"]);
		data.roomData.matrix = environment.game.rooms.converter.toNumeric(rooms[roomId]["baseString"]); // to stop deprecation
    data.roomData.shorthandFurni = rooms[roomId]["furni"];

		// Converting shorthand (green_grass:1,1) -> appropriate scheme for placing furniture
		environment.game.furni.expandShorthand(environment, rooms[roomId]["furni"])
			.then((longhand => {
				data.roomData.longhandFurni = longhand
			}))
			.then(function(){
				//# Combining the longhand + originalBase to get a wholistic app view
				// data.roomData.base = data.roomData.originalBase;
				data.roomData.base = environment.game.furni.floorplanMerge(environment, data.roomData.base, data.roomData.longhandFurni);

			})
			.then(function(){
				environment.event.emit("load room", frontend, data);
			})
	});
};
