// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    if(!args[0]) return message.channel.send(`Please provide a user ID or user tag.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    banList = await message.guild.fetchBans();
    let offlineUser;
    if(args.join('_').search('#') > 0) {
        offlineUser = args.join(' ')
    } else {
        offlineUser = args[0];
    }
    banList.forEach(aBan => {
        if(aBan.user.id == offlineUser || aBan.user.username+'#'+aBan.user.discriminator == offlineUser) {
            message.guild.members.unban(aBan.user.id).catch(console.error)
            message.channel.send(`**User ${aBan.user.username+'#'+aBan.user.discriminator} has been unbanned.**`).catch(console.error)

            if(config["logging_module"].enable_ban_logging) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Action Logs", bot.user.avatarURL())
                    .setColor('#ff9494')
                    .setDescription("**Action:** User Unbanned")
                    .addField("Unbanned User:", `ID: ${aBan.user.id} - Hash: ${aBan.user.username+'#'+aBan.user.discriminator}`)
                    .addField("Unbanned By:", `${message.author} - ID: ${message.author.id} - Hash: ${message.author.tag}`)
                    .addField("Time:", `${message.createdAt.toLocaleString()}`)
                    .setTimestamp()
                    .setFooter(config["bot_setup"].copyright);
            
                config["logging_module"].ban_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'ban_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send(embed).catch();
                    }
                });
            }
        }
    });
};

module.exports.help = {
    name: "unban",
    category: 4,
    perm: config["command_perms"].unban_needed_perm,
    description: "Unbans a user via ID or tag. Usage: unban <user>",

}