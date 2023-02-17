// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let yeahIChangedTheVariableSoThisIsNotStolenLol = args.join(" ");
    const embed = new Discord.MessageEmbed()
        .setAuthor(`Notice From ${message.author.username}`, message.author.avatarURL())
        .setColor(config["bot_setup"].feature_color)
        .setDescription(`${yeahIChangedTheVariableSoThisIsNotStolenLol}`)
        .setTimestamp()
        .setFooter(config["bot_setup"].copyright);
    message.channel.send(embed).catch(console.error)
    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag} echoed an embedded message as the bot.`)
};

module.exports.help = {
    name: "sayem",
    name2: "echoem",
    category: 4,
    perm: config["command_perms"].say_needed_perm,
    description: "Echo a message as the bot in an embed. Usage: sayem <message>",

}