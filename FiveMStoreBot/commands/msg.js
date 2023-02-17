// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!mentionedUser) return message.channel.send(`You must provide a user.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    let yeahIChangedTheVariableSoThisIsNotStolenLol = args.slice(1).join(" ");
    try{
        await mentionedUser.send(`**__Mesage From Staff via Bot:__\n\n**${yeahIChangedTheVariableSoThisIsNotStolenLol}`);
        message.channel.send(`Sent...`).then(msg => msg.delete({timeout: 8000})).catch(console.error);
    }catch(e){
        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${mentionedUser.user.tag}). Their DMs might be locked.`);
        message.channel.send(`Could not DM that user their DMs might be locked.`).then(msg => msg.delete({timeout: 8000})).catch(console.error);
    }
};

module.exports.help = {
    name: "msg",
    name2: "message",
    category: 4,
    perm: config["command_perms"].message_needed_perm,
    description: "DM users through the bot. Good tool to reply to bot DMs.",

}