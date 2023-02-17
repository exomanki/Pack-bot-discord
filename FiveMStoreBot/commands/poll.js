// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let yeahIChangedTheVariableSoThisIsNotStolenLol = args.join(" ");
    if(yeahIChangedTheVariableSoThisIsNotStolenLol.length < 1) return message.channel.send("Please specify a question to ask.").then(msg => msg.delete({timeout: 5000}));

    const embed = new Discord.MessageEmbed()
        .setAuthor(`Poll Created By ${message.author.username}`, message.author.avatarURL())
        .setColor(config["bot_setup"].feature_color)
        .setDescription(`__**Question:**__\n${yeahIChangedTheVariableSoThisIsNotStolenLol}`)
        .setTimestamp()
        .setFooter(config["bot_setup"].copyright);
    message.channel.send(embed).then(msg => {
        msg.react('❌').then(() => msg.react('✅'));
    }).catch(console.error);
};

module.exports.help = {
    name: "poll",
    category: 2,
    perm: config["command_perms"].poll_needed_perm,
    description: "Create a checkmark based poll.",

}