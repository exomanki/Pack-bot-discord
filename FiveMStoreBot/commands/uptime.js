// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args, connection) => {
    message.channel.send(`I've been online for \`${ms(bot.uptime, { long: true })}\``).then(msg => msg.delete({timeout: 10000})).catch(console.error);
};

module.exports.help = {
    name: "uptime",
    category: 2,
    perm: 4,
    description: "Get the bots uptime.",

}