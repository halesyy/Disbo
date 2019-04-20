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
app.service('roomHandler', ['$rootScope', function($rootScope) {
	return {

		generateModel: function(b) {
			var c = {
					0: "floor",
					1: "empty",
					2: "wall-left",
					3: "wall-right",
					4: "door"
				},
				a = $("#map");

			$(a).css("width", 62 * (b.length + 1) + "px");
			$(a).css("height", 32 * (b[0].length - .5) + "px");
			$(a).css("position", "absolute");
			$(a).css("top", "50%");
			$(a).css("left", "50%");

			var d = .5 * parseInt($(a).css("width")),
				e = .5 * parseInt($(a).css("height"));
			$(a).css("margin-left", -d + "px");
			$(a).css("margin-top", -e + "px");
			a = 31 * b.length;

			for (yIndex = 0; yIndex < b.length; yIndex++) {
				for (xIndex = 0; xIndex < b[yIndex].length; xIndex++) {
					topValue = 16 * yIndex + 16 * xIndex,
						leftValue = 32 * xIndex - 32 * yIndex,
						sprite = c[b[yIndex][xIndex]],
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

		generateFurni: function(furni) {
			this.appendFurniPart = function(furnidata, furnielement, furnipartposition, furnipartid) {
        /*
        {
            id: 1,
            title: "Not a shit named furni like habbo do",
            description: "Hello!",
            walkable: true,
            floor: false,
            root: 3:1,
            adjacent: [
              #x:y, what to increase values by
              #e.g. this would be a 2x2 structure, starting at x=3,y=1, spanning
              #3,2 - 4,1 - 4,2
              '0:1',
              '1:0',
              '1:1'
            ] // figure out how to represent this, explains in what relation it has to the other tiles
        }

        {
            "name": "green-floor",
            "formal": "Green Floor",
            "locations": {
              "0:0": "assets/furni/floors/green-floor-1x1.png",
              "1:0": "assets/furni/floors/green-floor-1x1.png",
              "0:1": "assets/furni/floors/green-floor-1x1.png",
              "1:1": "assets/furni/floors/green-floor-1x1.png",
            }
        }

        EACH TILE IS WIDTH: 66px;, HEIGHT: 40px.
        */
				var img = $('<img class="furni-part" />');
				$(img).attr('src', 'assets/images/furniture/' + furnidata.name + '/' + furnipartid + '.png');
				$(img).load(function() {
					$(img).css('display', 'inline-block');
					var furnipartpositions = furnipartposition.split(':');
					var furniparttile = $(
						'[data-x=' + furnipartpositions[0] + '][data-y=' + furnipartpositions[1] + ']'
					);
          console.log(furnidata);
          console.log(furnielement);
          console.log(furnipartposition);
          console.log(furnipartid);

          // console.log(furnidata, furnielement, furnipartposition, furnipartid)
					var top = parseInt($(furniparttile).css('top'));
					var left = parseInt($(furniparttile).css('left'));

					$(this).css('top', (top-this.height) + 'px');
					$(this).css('left', (left) + 'px');

					$(this).appendTo(furnielement);
				});
			};
			for (var i in furni) {
				var furnielement = $('<div class="furni" />');
				for (var x in furni[i]['tiles']) {
					this.appendFurniPart(furni[i], furnielement, furni[i]['tiles'][x], x);
				};
				$('#map #map-furni').append(furnielement);
			}
		}

	}
}]);
