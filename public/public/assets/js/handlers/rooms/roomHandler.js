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

// THIS IS A PUBLIC FILE

app.service('roomHandler', ['$rootScope', function($rootScope) {
	return {

		generateModel: function(base) {
      b = base

      // Mapping the base to root out pre-sprite variables for simplicity
      // for (rowx in base)
      //   for (colx in base[rowx])
      //     for (search in preSpriteConverter) {
      //       replace = preSpriteConverter[search]
      //       base[rowx][colx] = base[rowx][colx].replace(search, replace);
      //     }
      // console.log(base);

			var spriteConverter = {
					0: "floor",
					1: "empty",
					2: "wall-left",
					3: "wall-right",
					4: "door",
          5: "inline-corner",
          6: "unclickable-floor"
      };

			var a = $("#map");

			$(a).css("width", 62 * (b.length + 1) + "px");
			$(a).css("height", 32 * (b[0].length - .5) + "px");
			$(a).css("position", "absolute");
			$(a).css("top",  "50%");
			$(a).css("left", "50%");

			var d = .5 * parseInt($(a).css("width")),
				  e = .5 * parseInt($(a).css("height"));
			$(a).css("margin-left", -d + "px");
			$(a).css("margin-top",  -e + "px");
			a = 31 * b.length;

			for (yIndex = 0; yIndex < b.length; yIndex++) {
				for (xIndex = 0; xIndex < b[yIndex].length; xIndex++) {
					topValue = 16 * yIndex + 16 * xIndex,
						leftValue = 32 * xIndex - 32 * yIndex,
						sprite = spriteConverter[b[yIndex][xIndex]],
						inside = $("<div></div>"),
						$(inside).addClass("inner"),
						$(inside).html(xIndex + ":" + yIndex),
						tile = $("<div></div>"),
						$(tile).attr("data-x", xIndex),
						$(tile).attr("data-y", yIndex),
						tmp = $("<div></div>"),
						$(tmp).append(inside),
						$(tile).html($(tmp).html()),
						$(tile).addClass("tile"),
						$(tile).addClass(sprite),
						$(tile).css("top", topValue + 0 + "px"),
						$(tile).css("left", leftValue + a + "px"),
						$("#map #map-tiles").append(tile);
				}
			}
		},

		/*
		 * generating appropriate furniture
		 * scheme: {
		 *	 nameId: nameIdentifier,
		 *	 description: row.description,
		 *	 adjacentLocations: row.adjacentLocations,
		 *	 rotateable: row.rotateable,
		 *	 walkable: row.walkable,
		 *	 rootBlock: basexy
		 * }
     * also, setup the click event for if clicked to be removed :P
		 */
		generateFurniture: function(longhandFurni, $socket) {

      //# iterating over each piece of furniture to be
      //# introduced into the gameworld
			for (furnix in longhandFurni) {

				const schemeData = longhandFurni[furnix];
        // console.log(schemeData);
        const rootBlock = schemeData.rootBlock.split(',')
        const walkable = schemeData.walkable
        const x = parseInt(rootBlock[0]); //r
        const y = parseInt(rootBlock[1]); //r
        //# the furniture container
        adjacents = [schemeData.adjacents.split("\n")[0]];
        // Iterating over each tile worth of data
        for (var rowidx in adjacents) {
            const $FurniParent = $(`<div class="furni unclickable" id="${schemeData.inventoryID}-${rowidx}" data-fid="${schemeData.inventoryID}""></div>`);

            // every piece of furni gets it's own little allowance
            // for removing itself.
            $FurniParent.click(function(event){
              if (event.ctrlKey || event.metaKey) {
                // console.log(`Youre interested in ${$(this).attr("data-fid")}`);
                // alert("You just clicked to remove a piece of furniture")
                const fid = $(this).attr("data-fid");
                $socket.emit("verify remove furniture", {
                  sso: clientVars.sso,
                  inventoryID: $(this).attr("data-fid"),
                  roomID: $rootScope.roomId
                }, function(response){
                  if (response.error === false) {
                    // worked, rid should be removed for all users
                    $rootScope.refreshInventory();
                  }
                  else {
                    $rootScope.dialog = {
                      enabled: true,
                      title: "Oops!",
                      body: response.reason
                    }
                  }
                })
              }
            });

            // rowData = adjacents[rowidx].split(': ');
            const xyMovement = adjacents[rowidx].split(',');
            const xmove = parseInt(xyMovement[0])
            const ymove = parseInt(xyMovement[1])
            const filelocation = schemeData.location;
            const bottomAdjust = schemeData.bottomAdjust;

            // Furni location
            const furniChildX = x + xmove;
            const furniChildY = y + ymove;

            // Loading image, then appending to the furni class
            const $img = $("<img class='furni-part' />");
            $img.attr('src', `assets/furni/${filelocation}`);
            $img.attr('position', `absolute`);

            const $tile = $(`[data-x=${furniChildY}][data-y=${furniChildX}]`);
            // ADJUST
            const tileBottom = parseInt($tile.css("bottom")) + 10 + bottomAdjust;
            const tileLeft = parseInt($tile.css("left"));
            var baselayer = 7;
            if ("baselayer" in schemeData) baselayer += parseInt(schemeData.baselayer);
            $FurniParent.css('bottom',  `${tileBottom}px`);
            $FurniParent.css('left', `${tileLeft}px`);
            $FurniParent.css('z-index', baselayer);
            $FurniParent.css('position', `absolute`);
            // console.log(baselayer);

            $img.load(function(){

                $FurniParent.height ($img[0].height);
                $FurniParent.width  ($img[0].width);
                // $img.css("bottom": )
                $(this).css('display', 'inline-block');
                $(this).addClass('click-through');
                const $tile = $(`[data-x=${furniChildY}][data-y=${furniChildX}]`);
                $(this).css('z-index', baselayer);
                $FurniParent.append($(this))
            });
            $('#map-furni').append($FurniParent);
        }
      }
		}
	}
}]);
