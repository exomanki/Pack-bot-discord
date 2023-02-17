// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    return message.channel.send(`:ping_pong: Pong! Latency is: **${new Date().getTime() - message.createdTimestamp}ms**`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
};

module.exports.help = {
    name: "ping",
    category: 2,
    perm: config["command_perms"].ping_needed_perm,
    description: "Ping the bot and see if how it's going.",

}