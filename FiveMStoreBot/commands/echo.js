// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let yeahIChangedTheVariableSoThisIsNotStolenLol = args.join(" ");
    if(yeahIChangedTheVariableSoThisIsNotStolenLol.length < 1) return message.channel.send("Please specify a message.").then(msg => msg.delete({timeout: 5000}));
    message.channel.send(yeahIChangedTheVariableSoThisIsNotStolenLol).catch(console.error);
    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag} echoed a message as the bot.`)
};

module.exports.help = {
    name: "say",
    name2: "echo",
    category: 4,
    perm: config["command_perms"].say_needed_perm,
    description: "Echo a message as the bot. Usage: say <message>",

}