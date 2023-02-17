// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var serverLock = false;

module.exports.run = async (bot, connection) => {
    bot.on('guildMemberAdd', async member => {
        if(serverLock) {
            try{
                await member.send(`**Notification [SERVER LOCKDOWN]**\nThis is a notification to say that you have been removed from __${member.guild.name}__ due to a **server lockdown**. Try joining back soon!`);
            }catch(e){
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${member.user.tag}). Their DMs might be locked.`);
            }
            member.kick(`Server in lockdown.`);
            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${member.user.tag} was kicked due to server lockdown.`);
        }
    });

    var methodsServerLock = {};
    // AUTO
    methodsServerLock.toggleServerLockDown = function(daChannel) {
        serverLock = !serverLock;
        daChannel.send(`Server lockdown toggled \`${serverLock}\`.`)
    };
    exports.data = methodsServerLock;
};