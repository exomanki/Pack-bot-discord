// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    if(!config["command_perms"].use_custom_perms) {if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:x: Insufficient permissions.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);}
    warnId = args[0];
    if(!warnId) return message.channel.send(`You must provide a warning ID.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);

    if(config["db_setup"].usedb) {
        connection.query(`DELETE FROM warnings WHERE wid = ${warnId}`, function (err, result) {
            if (err) throw err;
        });
    } else {
        let warningsJson = await JSON.parse(fs.readFileSync('./db/warnings.json', "utf8"));
        delete warningsJson[warnId];
        fs.writeFile("./db/warnings.json", JSON.stringify(warningsJson, null, 4), (err) => {
            if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating warnings.json file. See below error for details\n${err}`);
        });
    }
    message.channel.send(`**Removed warning \`#${warnId}\`.**`).then(msg => msg.delete({timeout: 10000})).catch(console.error);

    if(config["logging_module"].enable_warn_logging) {
        const embed = new Discord.MessageEmbed()
            .setAuthor("Action Logs", bot.user.avatarURL())
            .setColor('#e39336')
            .setDescription("**Action:** Warned Removed")
            .addField("Time:", `${message.createdAt.toLocaleString()}`)
            .addField("Warning ID:", `${warnId}`)
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
};

module.exports.help = {
    name: "unwarn",
    category: 4,
    perm: config["command_perms"].unwarn_needed_perm,
    description: "Remove a users warning. Usage: unwarn <warning id>",

}