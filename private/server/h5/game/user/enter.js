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

	frontend.on("load room", async function(data) {

		const roomId = data["roomId"]
		const roomData = await environment.game.rooms.db.loadFromId(roomId);
		const furniData = await environment.game.rooms.db.shorthandFurni(roomId);
		data.roomData = {}
		// console.log(furniData);
		// furniArrayGoesHere = [];

		// Identifiers are the string-based variable changes in the room, such as d=door
    data.roomData.baseIdentifierArray = environment.game.rooms.converter.fromString(roomData.base);
		data.roomData.baseIdentifierString = roomData.base;
		// The original, safe, only-numeric matrix/base as well as furnishorthands
		data.roomData.base   = environment.game.rooms.converter.toNumeric(roomData.base);
		data.roomData.matrix = environment.game.rooms.converter.toNumeric(roomData.base); // to stop deprecation
    data.roomData.shorthandFurni = furniData;

		// Converting shorthand (green_grass:1,1) -> appropriate scheme for placing furniture

		environment.game.furni.expandShorthand(environment, furniData)
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
