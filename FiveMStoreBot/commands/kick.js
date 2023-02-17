// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!mentionedUser) return message.channel.send(`You must provide a user.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    if(!config["command_perms"].use_custom_perms) {if(mentionedUser.hasPermission("KICK_MEMBERS")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let reason = args.slice(1).join(' ');
    if(!reason) return message.channel.send(`You must provide a reason.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);

    // Logging
    if(config["logging_module"].enable_kick_logging) {
        const embed = new Discord.MessageEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL())
            .setColor('#ff5454')
            .setDescription("**Action:** User Kicked")
            .addField("Kicked User:", `${mentionedUser} - ID: ${mentionedUser.id} - Hash: ${mentionedUser.user.tag}`)
            .addField("Kicked By:", `${message.author} - ID: ${message.author.id} - Hash: ${message.author.tag}`)
            .addField("Time:", `${message.createdAt.toLocaleString()}`)
            .addField("Reason:", `${reason}`)
            .setTimestamp()
            .setFooter(config["bot_setup"].copyright);
    
        config["logging_module"].kick_channels.forEach(channelId => {
            let channel = bot.channels.cache.get(channelId);
            if(!channel) {
                console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'kick_channels'. Please check your configured channel ID's.`)
            } else {
                channel.send(embed).catch();
            }
        });
    }

    // DM message
    if(config["moderation_module"].dm_kicked_user) {
        try{
            await mentionedUser.send(`**Notification**\nThis is a notification to say that you have been kicked from __${message.guild.name}__ for the following reason(s):\n${reason}`);
        }catch(e){
            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${mentionedUser.user.tag}). Their DMs might be locked.`);
        }
    }

    // Kick user
    message.guild.member(mentionedUser).kick(reason);
    message.channel.send(`**${mentionedUser} (${mentionedUser.user.tag}) was kicked for:** ${reason}`).catch(console.error);

    if(config["leveling_module"].remove_levels_on_removal) {
        if(config["db_setup"].usedb) {
            connection.query(`DELETE FROM chatlvl WHERE id = '${mentionedUser.id}'`, (error, result) => {
                if (error) throw error;
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${mentionedUser.user.tag}) had their chat level removed as they were kicked.`);
            })
        } else {
            let chatLvlJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));
            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${mentionedUser.user.tag}) had their chat level removed as they were kicked.`);
            if(chatLvlJson[mentionedUser.id]) {
                delete chatLvlJson[mentionedUser.id];
                fs.writeFile("./db/chatlvl.json", JSON.stringify(chatLvlJson, null, 4), (err) => {
                    if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating chatlvl.json file. See below error for details\n${err}`);
                });
            }
        }
    }

    if(config["admin_management"].enable_user_statistics) {
        if(config["db_setup"].usedb) {
            connection.query(`SELECT * FROM users WHERE id = '${mentionedUser.id}'`, function (err, resultChat) {
                if(resultChat[0]) {
                    connection.query(`UPDATE users SET kicks = kicks + 1 WHERE id = '${mentionedUser.id}'`, (error, result) => {
                        if (error) throw error;
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                    });
                    connection.query(`UPDATE users SET actkicks = actkicks + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                        if (error) throw error;
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                    });
                }
            });
        } else {
            let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
            if(usersJson[mentionedUser.id]) {
                usersJson[mentionedUser.id].kicks = ++usersJson[mentionedUser.id].kicks;
            }
            if(usersJson[message.author.id]) {
                usersJson[message.author.id].actkicks = ++usersJson[message.author.id].actkicks;
            }
            fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
            });
        }
    }
};

module.exports.help = {
    name: "kick",
    category: 4,
    perm: config["command_perms"].kick_needed_perm,
    description: "Kick a user. Usage: kick <@user> <reason>",

}