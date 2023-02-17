// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let yeahIChangedTheVariableSoThisIsNotStolenLol = args.join(" ");
    bot.user.setPresence({activity: {name: yeahIChangedTheVariableSoThisIsNotStolenLol}}).catch(console.error);
};

module.exports.help = {
    name: "setstatus",
    category: 4,
    perm: config["command_perms"].set_status_needed_perm,
    description: "Set the bots presence. Usage: setstatus <status>",

}