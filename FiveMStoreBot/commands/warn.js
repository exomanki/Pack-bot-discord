// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!mentionedUser) return message.channel.send(`You must provide a user.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    if(!config["command_perms"].use_custom_perms) {if(mentionedUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    let reason = args.slice(1).join(' ');
    if(!reason) return message.channel.send(`You must provide a reason.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    
    if(config["db_setup"].usedb) {
        connection.query(`INSERT INTO warnings (id, date, reason) VALUES ('${mentionedUser.id}', '${message.createdAt.toLocaleString()}', '${reason.split(`'`).join('')}')`, function (err, result) {
            if (err) throw err;
        });
    } else {
        let warningsJson = await JSON.parse(fs.readFileSync('./db/warnings.json', "utf8"));

        warnId = message.id.charAt(0)+message.id.substr(message.id.length - 4);
        warningsJson[warnId] = {
            id: mentionedUser.id,
            date: message.createdAt.toLocaleString(),
            reason: reason
        };
        fs.writeFile("./db/warnings.json", JSON.stringify(warningsJson, null, 4), (err) => {
            if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating warnings.json file. See below error for details\n${err}`);
        });
    }

    // Logging
    if(config["logging_module"].enable_warn_logging) {
        const embed = new Discord.MessageEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL())
            .setColor('#ff8900')
            .setDescription("**Action:** User Warned")
            .addField("Warned User:", `${mentionedUser} - ID: ${mentionedUser.id} - Hash: ${mentionedUser.user.tag}`)
            .addField("Warned By:", `${message.author} - ID: ${message.author.id} - Hash: ${message.author.tag}`)
            .addField("Time:", `${message.createdAt.toLocaleString()}`)
            .addField("Reason:", `${reason}`)
            .setTimestamp()
            .setFooter(config["bot_setup"].copyright);
    
        config["logging_module"].warn_channels.forEach(channelId => {
            let channel = bot.channels.cache.get(channelId);
            if(!channel) {
                console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'warn_channels'. Please check your configured channel ID's.`)
            } else {
                channel.send(embed).catch();
            }
        });
    }
    // DM message
    if(config["moderation_module"].dm_warned_user) {
        try{
            await mentionedUser.send(`**Notification**\nThis is a notification to say that you have been warned in __${message.guild.name}__ for the following reason(s):\n${reason}`);
        }catch(e){
            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${mentionedUser.user.tag}). Their DMs might be locked.`);
        }
    }

    message.channel.send(`**${mentionedUser} (${mentionedUser.user.tag}) has been warned for:** ${reason}`).catch(console.error);

    if(config["admin_management"].enable_user_statistics) {
        if(config["db_setup"].usedb) {
            connection.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, function (err, resultChat) {
                if(resultChat[0]) {
                    connection.query(`UPDATE users SET actwarns = actwarns + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                        if (error) throw error;
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                    });
                }
            });
        } else {
            let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
            if(usersJson[message.author.id]) {
                usersJson[message.author.id].actwarns = ++usersJson[message.author.id].actwarns;
            }
            fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
            });
        }
    }
};

module.exports.help = {
    name: "warn",
    category: 4,
    perm: config["command_perms"].warn_needed_perm,
    description: "Warn a user for an action. Usage: warn <@user> <reason>",

}