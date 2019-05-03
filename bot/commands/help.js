exports.run = (client, message, args) => {
  const embed = {
    "description": "**Disbo Help**",
    "url": "https://discordapp.com",
    "color": 60795,
    "timestamp": "2019-05-01T01:26:02.219Z",
    "footer": {
      "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
      "text": "Disbo Robot"
    },
    "fields": [
      {
        "name": "`.setup`",
        "value": "Create your Disbo room"
      },
      {
        "name": "`.privacy`",
        "value": "Change the privacy setting of your Disbo room, `default: public`"
      },
      {
        "name": "`.name`",
        "value": "Change the display name of your room on Disbo"
      }
    ]
  };
    message.channel.send({ embed }).catch(console.error);
}
