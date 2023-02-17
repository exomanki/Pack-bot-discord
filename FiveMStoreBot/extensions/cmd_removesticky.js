// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    let stickiesJson = await JSON.parse(fs.readFileSync('./db/stickymessages.json', "utf8"));

    if(config["db_setup"].usedb) {
        connection.query(`SELECT * FROM stickymessages WHERE channelId = '${message.channel.id}'`, async function (err, resultChat) {
            if(resultChat[0]) {
                connection.query(`DELETE FROM stickymessages WHERE channelId = '${message.channel.id}'`, (error, result) => {
                    if (error) throw error;
                })
                message.channel.send("Sticky message removed.").then(msg => msg.delete({timeout: 5000}));
            } else {
                message.channel.send("There's no sticky message set in this channel.").then(msg => msg.delete({timeout: 5000}));
            }
        });
    } else {
        if(!stickiesJson[message.channel.id]) return message.channel.send("There's no sticky message set in this channel.").then(msg => msg.delete({timeout: 5000}));
        delete stickiesJson[message.channel.id];
        fs.writeFile("./db/stickymessages.json", JSON.stringify(stickiesJson), (err) => {
            if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating stickymessages.json file. See below error for details\n${err}`);
        });
        return message.channel.send("Sticky message removed.").then(msg => msg.delete({timeout: 5000}));
    }
};

module.exports.help = {
    name: "removesticky",
    name2: "rs",
    category: 4,
    perm: 2,
    description: "Remove a sticky message in the executing channel.",

}