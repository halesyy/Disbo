exports.run = (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_SERVER'))
      return message.channel.send('Only users with the `MANAGE_SERVER` permission can setup rooms on Disbo :(');

    message.channel.send('You\'re minutes away from setting up a room for your server!\nI just need you to choose a couple of options! :sparkles:\n\nChoose the privacy setting for your room `' + client.config.prefix + 'privacy public|private`').catch(console.error);
};
