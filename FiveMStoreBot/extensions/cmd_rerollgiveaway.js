// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        return false
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

module.exports.run = async (bot, message, args, connection) => {
    if(!args[0]) return message.channel.send(`You must provide a giveaway ID.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    gId = args[0].replace('#', '');
    let giveawaysJson = await JSON.parse(fs.readFileSync('./db/giveaways.json', "utf8"));
    if(!giveawaysJson[gId]) return message.channel.send(`Invalid giveaway ID.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    if(giveawaysJson[gId].active) return message.channel.send(`You can't re-reoll a giveaway that has not ended yet.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    let reactionsArray = giveawaysJson[gId].finalArray;
    giveawaysJson[gId].winnersArray.forEach(element => {
        reactionsArray.splice(reactionsArray.indexOf(element), 1);
    });
    const rerollWinner = getRandom(reactionsArray, 1);
    var daChannel = message.guild.channels.cache.get(giveawaysJson[gId].giveawayIDs[2]);
    daChannel.send(`>>> Re-roll performed and the new winner is... <@${rerollWinner[0]}>.\nRe-rolled by: ${message.author}`).catch(console.error);
};

module.exports.help = {
    name: "greroll",
    name2: "grr",
    category: 4,
    perm: 2,
    description: "Re-select a giveaway winner.",

}