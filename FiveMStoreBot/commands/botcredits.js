// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(`__${bot.user.username}__ Created By __FiveM-Store.Com__`)
        .setURL('https://fivem-store.com')
        .setThumbnail(`tools/gif.gif`)
        .setColor(`#0c75f3`)
        .setDescription(`This bot (FiveMStoreBot) gives a guild owner the ability to change the experience for their users when in their Discord. FiveMStoreBot comes with 125+ configuration options straight off the bat allowing some of the best customisation and ability.\nOverflow is made by **\`-MeTi-#1111\`**`)
        .addFields(
            {name: `Bot Name:`, value: `${bot.user.username} (Original: FiveMStoreBot)`},
            {name: `Get A Copy:`, value: `**[FiveM Store](https://fivem-store.com/)** *(www.fivem-store.com)*`},
            {name: `Credits:`, value: `-MeTi-#1111`},
        )
        .setTimestamp()
        .setFooter(`© 2020, FiveM Store Company`);
    message.channel.send(embed).then(msg => msg.delete({timeout: 60000})).catch(console.error);
};

module.exports.help = {
    name: "fivemstorebot",
    name2: "botcredits",
    category: 2,
    perm: 4,
    description: "Displays the original bots author and how you can obtain it.",
}