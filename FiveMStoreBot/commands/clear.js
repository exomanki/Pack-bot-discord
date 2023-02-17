// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let amount = args[0];


    if (!amount) return message.channel.send(`You must supply an amount of messages to delete`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    if (isNaN(amount)) return message.channel.send(`You must supply a number`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    if (amount < 1) return message.channel.send(`You must delete at least one message.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    if (amount > 100) return message.channel.send(`You can't delete more than 100 messages at a time.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);

    setTimeout(async() => { // This is to ensure the command message is deleted.
        await message.channel.messages.fetch({limit: amount}).then(messages => {
            message.channel.bulkDelete(messages).then(() => {
                message.channel.send(`Cleared \`${amount}\` messages.`).then(msg => msg.delete({timeout: 2000})).catch(console.error);
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag} bulk deleted ${amount} messages.`)
            });
        });
    }, 500);
};

module.exports.help = {
    name: "clear",
    name2: "purge",
    category: 4,
    perm: config["command_perms"].clear_needed_perm,
    description: "Bulk delete an amount of messages",

}