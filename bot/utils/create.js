const fetch = require('node-fetch');

module.exports = async (client) => {
  client.createRoom = async (guildID, roomName, ownerIDs) => {
    return new Promise(resolve => {
      let options = {
        guildID: guildID,
        roomName: roomName,
        public: true,
        ownerIDs: ownerIDs,
      };
      console.log(options)
      // const setPrivacy = await fetch(client.config.gameServer.host, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(options),
      // });
      //
      // if (setPrivacy.ok) {
      // }
      var x = {
        success: true
      }
      resolve(x);

    })
  };
};
