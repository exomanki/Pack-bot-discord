// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!mentionedUser) return message.channel.send(`You must provide a user.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    if(!config["command_perms"].use_custom_perms) {if(mentionedUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let muteTime = args.slice(1).join(' ');
    if (!muteTime) muteTime = "2m";
        
    let role = message.guild.roles.cache.get(config["moderation_module"].mute_role);
    if(!role) {
        return console.log(`\x1b[91m[ALERT] \x1b[0mRole (${config["moderation_module"].mute_role}) not found for 'mute_role'. Please check your configured role ID's.`)
    } else {
        message.guild.member(mentionedUser).roles.add(role).catch(console.error);
    }

    message.guild.channels.cache.forEach(async (channel, id) => {
        if(channel.type == 'voice') {
            await channel.createOverwrite(role, {
                SPEAK: false,
                PRIORITY_SPEAKER: false
            });
        } else {
            await channel.createOverwrite(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        } 
    });

    // Logging
    if(config["logging_module"].enable_mute_logging) {
        const embed = new Discord.MessageEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL())
            .setColor('#ffbe73')
            .setDescription("**Action:** User Muted")
            .addField("Muted User:", `${mentionedUser} - ID: ${mentionedUser.id} - Hash: ${mentionedUser.user.tag}`)
            .addField("Muted By:", `${message.author} - ID: ${message.author.id} - Hash: ${message.author.tag}`)
            .addField("Time:", `${message.createdAt.toLocaleString()}`)
            .addField("Time Muted For:", `${muteTime}`)
            .setTimestamp()
            .setFooter(config["bot_setup"].copyright);
    
        config["logging_module"].mute_channels.forEach(channelId => {
            let channel = bot.channels.cache.get(channelId);
            if(!channel) {
                console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'mute_channels'. Please check your configured channel ID's.`)
            } else {
                channel.send(embed).catch();
            }
        });
    }

    // DM message
    if(config["moderation_module"].dm_muted_user) {
        try{
            await mentionedUser.send(`**Notification**\nThis is a notification to say that you have been muted in __${message.guild.name}__ for \`${muteTime}\``);
        }catch(e){
            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${mentionedUser.user.tag}). Their DMs might be locked.`);
        }
    }


    message.channel.send(`**${mentionedUser} (${mentionedUser.user.tag}) has been muted for ${ms(ms(muteTime), {long: true})}**`).catch(console.error);

    if(config["admin_management"].enable_user_statistics) {
        if(config["db_setup"].usedb) {
            connection.query(`SELECT * FROM users WHERE id = '${mentionedUser.id}'`, function (err, resultChat) {
                if(resultChat[0]) {
                    connection.query(`UPDATE users SET mutes = mutes + 1 WHERE id = '${mentionedUser.id}'`, (error, result) => {
                        if (error) throw error;
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                    });
                    connection.query(`UPDATE users SET actmutes = actmutes + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                        if (error) throw error;
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                    });
                }
            });
        } else {
            let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
            if(usersJson[mentionedUser.id]) {
                usersJson[mentionedUser.id].mutes = ++usersJson[mentionedUser.id].mutes;
            }
            if(usersJson[message.author.id]) {
                usersJson[message.author.id].actmutes = ++usersJson[message.author.id].actmutes;
            }
            fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
            });
        }
    }

    setTimeout(function(){
        message.guild.member(mentionedUser).roles.remove(role).catch(console.error);
        message.reply(`${mentionedUser.user.tag} has been unmuted after \`${muteTime}\`.`);
    }, ms(muteTime));
};

module.exports.help = {
    name: "mute",
    category: 4,
    perm: config["command_perms"].mute_needed_perm,
    description: "Mute a user for the specified amount of time. Usage: mute <@user> <time>",

}