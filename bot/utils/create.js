const fetch = require('node-fetch');

module.exports = async (client) => {
  client.createRoom = async (guildID, roomName, ownerIDs) => {

      let options = {
        guildID: guildID,
        roomName: roomName,
        public: true,
        ownerIDs: ownerIDs,
      };

      const createRoom = await fetch(`https://` + client.config.gameServer.host + ":" + client.config.gameServer.port + `/api/rooms/${guildID}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (createRoom.ok) {
        const createRoomBody = await createRoom.json();
        console.log(createRoomBody);
        return new Promise(resolve => {
            if (!createRoomBody.error) { resolve({
              success: true,
              guildID: guildID
            });
          } else {
            resolve({
              success: false,
              reason: createRoomBody.reason,
            })
          }
        })
      }
  };
};
