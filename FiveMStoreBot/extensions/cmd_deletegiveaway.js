// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args, connection) => {
    if(!args[0]) return message.channel.send(`You must provide a giveaway ID.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    gId = args[0].replace('#', '');
    let giveawaysJson = await JSON.parse(fs.readFileSync('./db/giveaways.json', "utf8"));
    if(!giveawaysJson[gId]) return message.channel.send(`Invalid giveaway ID.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    if(!giveawaysJson[gId].active) return message.channel.send(`You can't delete a giveaway thats already ended.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    var daChannel = message.guild.channels.cache.get(giveawaysJson[gId].giveawayIDs[2]);
    daChannel.messages.fetch(giveawaysJson[gId].giveawayIDs[1]).then(msg => {
        msg.edit(`This giveaway was deleted by ${message.author}`);
        msg.suppressEmbeds();
    });
    message.channel.send(`Giveaway deleted.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    delete giveawaysJson[gId];
    fs.writeFile("./db/giveaways.json", JSON.stringify(giveawaysJson), (err) => {
        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating giveaways.json file. See below error for details\n${err}`);
    });
};

module.exports.help = {
    name: "gdelete",
    name2: "gd",
    category: 4,
    perm: 2,
    description: "Delete a giveaway",

}