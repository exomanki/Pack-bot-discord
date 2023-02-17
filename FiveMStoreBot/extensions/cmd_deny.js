// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

var applicationConfig = {
    deny_channels: [""],
    deny_message: "Your application has been denied for"
}

module.exports.run = async (bot, message, args, connection) => {
    if(!args[0]) return message.channel.send(`You must provide a application ID.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    appId = args[0].replace('#', '');
    let reason = args.slice(1).join(' ');
    if(!reason) return message.channel.send(`You must provide a denial reason.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
    let applicationsJson = await JSON.parse(fs.readFileSync('./db/applications.json', "utf8"));
    if(!applicationsJson[appId]) return message.channel.send(`Invalid application ID.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);

    applicationConfig.deny_channels.forEach(channelId => {
        let channel = bot.channels.cache.get(channelId);
        if(!channel) {
            console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'application/deny_channels'. Please check your configured channel ID's.`)
        } else {
            channel.send(`\`#${appId}\` <@${applicationsJson[appId].userId}>\n${applicationConfig.deny_message}\n> ${reason}`).catch();
        }
    });
    delete applicationsJson[appId];
    fs.writeFile("./db/applications.json", JSON.stringify(applicationsJson, null, 4), (err) => {
        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating applications.json file. See below error for details\n${err}`);
    });
};

module.exports.help = {
    name: "deny",
    category: 4,
    perm: 2,
    description: "Deny an application by its ID.",

}