// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    let reason = args.slice(1).join(' ');
    if(!reason) return message.channel.send(`You must provide a reason.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);

    if(mentionedUser) {
        if(mentionedUser.hasPermission("BAN_MEMBERS")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
        // Logging
        if(config["logging_module"].enable_ban_logging) {
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor('#ad0000')
                .setDescription("**Action:** User Banned")
                .addField("Banned User:", `${mentionedUser} - ID: ${mentionedUser.id} - Hash: ${mentionedUser.user.tag}`)
                .addField("Banned By:", `${message.author} - ID: ${message.author.id} - Hash: ${message.author.tag}`)
                .addField("Time:", `${message.createdAt.toLocaleString()}`)
                .addField("Reason:", `${reason}`)
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

        // DM message
        if(config["moderation_module"].dm_banned_user) {
            try{
                await mentionedUser.send(`**Notification**\nThis is a notification to say that you have been banned from __${message.guild.name}__ for the following reason(s):\n${reason}`);
            }catch(e){
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${mentionedUser.user.tag}). Their DMs might be locked.`);
            }
        }

        // Ban user
        message.guild.member(mentionedUser).ban({reason: reason});
        message.channel.send(`**${mentionedUser} (${mentionedUser.user.tag}) was banned for:** ${reason}`).catch(console.error);

        if(config["leveling_module"].remove_levels_on_removal) {
            if(config["db_setup"].usedb) {
                connection.query(`DELETE FROM chatlvl WHERE id = '${mentionedUser.id}'`, (error, result) => {
                    if (error) throw error;
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${mentionedUser.user.tag}) had their chat level removed as they were banned.`);
                })
            } else {
                let chatLvlJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${mentionedUser.user.tag}) had their chat level removed as they were banned.`);
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
                connection.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, function (err, resultChat) {
                    if(resultChat[0]) {
                        connection.query(`UPDATE users SET actbans = actbans + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                            if (error) throw error;
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                        });
                    }
                });
            } else {
                let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
                if(usersJson[message.author.id]) {
                    usersJson[message.author.id].actbans = ++usersJson[message.author.id].actbans;
                }
                fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                    if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
                });
            }
        }
    } else {
        let offlineUser;
        if(args.join('_').search('#') > 0) {
            let reasonStartPos = args.join('_').search('#') + 6;
            reason = args.join(' ').substring(reasonStartPos);
            offlineUser = args.join(' ').substring(0, reasonStartPos-1);
        } else {
            offlineUser = args[0];
        }
        // User's not in the Discord. Ban via ID
        if(config["db_setup"].usedb) {
            connection.query(`INSERT INTO offlinebans (id, reason) VALUES ('${offlineUser}', '${reason}')`, function (err, result) {
                if (err) throw err;
            });
        } else {
            let offlineBansJson = await JSON.parse(fs.readFileSync('./db/offlinebans.json', "utf8"));
            offlineBansJson[offlineUser] = {
                reason: reason
            };
            fs.writeFile("./db/offlinebans.json", JSON.stringify(offlineBansJson, null, 4), (err) => {
                if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating offlineBansJson.json file. See below error for details\n${err}`);
            });
        }
        const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor('#ad0000')
                .setDescription("**Action:** User Banned (Offline)")
                .addField("Banned User:", `${offlineUser}`)
                .addField("Banned By:", `${message.author} - ID: ${message.author.id} - Hash: ${message.author.tag}`)
                .addField("Time:", `${message.createdAt.toLocaleString()}`)
                .addField("Reason:", `${reason}`)
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
        message.channel.send(`**User \`${offlineUser}\` was banned for:** ${reason}`).catch(console.error);
    }

};

module.exports.help = {
    name: "ban",
    category: 4,
    perm: config["command_perms"].ban_needed_perm,
    description: "Ban a user via mention or ID. Usage: ban <user> <reason>",

}