// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args, connection) => {
    if(config["ticket_module"].enabled) {
        if(!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You're not in a ticket channel.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);

        message.channel.send(`Are you sure you want to close this ticket?`).then(msg => {
            msg.react('❌').then(() => msg.react('✅'));
    
            const filterE = (reaction, user) => {
                return ['❌', '✅'].includes(reaction.emoji.name) && user.bot == false; // && user.id === message.author.id
            };
            msg.awaitReactions(filterE, { max: 1, time: ms("20m"), errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                if(reaction.emoji.name === '❌') {
                    return message.channel.send(`Ticket close cancelled.`)
                }
                if(reaction.emoji.name === '✅') {
                    message.channel.send(`This ticket has now been **closed**.`)
                    setTimeout(() => {
                        message.channel.delete();
                        if(fs.existsSync(`./db/${message.channel.id}.json`)) {
                            fs.unlinkSync(`./db/${message.channel.id}.json`)
                        }
                    }, 10000);
                }
            }).catch(() => {
                message.channel.send('Ticket close timed out.')
            });
        }).catch(console.error);
    }
};

module.exports.help = {
    name: "close",
    category: 3,
    perm: config["command_perms"].close_needed_perm,
    description: "Close a ticket channel",

}