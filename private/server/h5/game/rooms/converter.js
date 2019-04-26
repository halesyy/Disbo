module.exports = {

    /*
    * converting from string into array format
    */
    fromString: function(baseString) {
      baseArray = []

      baseRows = baseString.split("\n");
      for (rowx in baseRows) {
        baseStringRow = baseRows[rowx];
        baseArray.push([]); // new row
        currentRow = baseArray.length-1 // getting into the array to push

        baseStringCols = baseStringRow.split(' ');
        for (columnx in baseStringCols) {
          baseStringColumn = baseStringCols[columnx];
          // getting the individual horizontal and pushing into hotizontal
          baseArray[currentRow].push(parseInt(baseStringColumn));
        }
      }

      return baseArray;
    },

    toNumeric: function(metaBaseString) {
      var preSpriteConverter = {
          "c": 1,
          "t": 3,
          "s": 2,
          "d": 4,
          "i": 5,
          "e": 6
      };

      // metaBaseString = this.fromArray(metaBaseArray);
      for (search in preSpriteConverter) {
        replace = preSpriteConverter[search]
        metaBaseString = metaBaseString.split(search).join(replace);
      }
      metaBaseArray = this.fromString(metaBaseString);
      // console.log(metaBaseString);
      return metaBaseArray;
    },

    /*
     * converting from array into string format
     */
    fromArray: function(baseArray) {
      // baseString = ""
      console.log(baseArray);
      for (rowx in baseArray)
        baseArray[rowx] = baseArray[rowx].join(' ')
      return baseArray.join("\n")
    },

    fromDbScheme: function(baseString) {
      baseReturn = [];


    }

}
