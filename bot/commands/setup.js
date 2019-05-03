exports.run = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_SERVER')) return message.channel.send('Only users with the `MANAGE_SERVER` permission can setup rooms on Disbo :(');

    const loading = client.emojis.find(emoji => emoji.name === "disboloading")
    const msg = await message.channel.send(loading + ' We\'re creating you\'re room! Hold on!').catch(console.error);

    const ownerIDs = [message.channel.guild.ownerID];
    if (message.author.id !== message.channel.guild.ownerID) ownerIDs.push(message.author.id);

    const createRoom = await client.createRoom(message.channel.guild.id, message.channel.guild.name, ownerIDs);
    if (createRoom.success) {
        msg.edit(`**Success!** Your room is now live at **<http://${client.config.gameServer.host}:3000/#!/room/${createRoom.guildID}>** :sparkles:\nClick the link and login with Discord to join the room and start the adventure! \n\nYou can also change the **privacy** and **name** of your room in the game, learn more using the **${client.config.prefix}help** command :fire:` )
    } else {
      msg.edit(createRoom.reason);
    }
};
