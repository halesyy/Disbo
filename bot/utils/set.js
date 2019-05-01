const fetch = require('node-fetch');

module.exports = async (client) => {
  client.setPrivacy = async (value, guildID) => {
    return new Promise(resolve => {
      // let options = {
      //   guildID: guildID,
      //   privacy: value
      // };
      //
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
      const a = false; // temp for now
      if (a) {
        resolve(true);
      } else {
        resolve(false);
      }

    })
  };
};
