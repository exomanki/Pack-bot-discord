// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    let stickiesJson = await JSON.parse(fs.readFileSync('./db/stickymessages.json', "utf8"));
    let yeahIChangedTheVariableSoThisIsNotStolenLol = args.join(" ").replace(/'/g, "\'");
    if(yeahIChangedTheVariableSoThisIsNotStolenLol.length < 1) return message.channel.send("Please specify a message.").then(msg => msg.delete({timeout: 5000}));
    // let stickyMessage = setMessage.replace(/'/g, "\'");
    
    if(config["db_setup"].usedb) {
        connection.query(`SELECT * FROM stickymessages WHERE channelId = '${message.channel.id}'`, async function (err, resultChat) {
            if(resultChat[0]) {
                message.channel.send("There's already a sticky message in this channel.").then(msg => msg.delete({timeout: 5000}));
            } else {
                let sentMessage = await message.channel.send(`:warning: __***Sticky Message, Read Before Typing!***__ :warning:\n${yeahIChangedTheVariableSoThisIsNotStolenLol}`);
                connection.query(`INSERT INTO stickymessages (channelId, lastId, message) VALUES ('${message.channel.id}', '${sentMessage.id}', '${yeahIChangedTheVariableSoThisIsNotStolenLol.replace(/'/g, "’")}')`, function (err, result) {
                    if (err) throw err;
                });
            }
        });
    } else {
        if(stickiesJson[message.channel.id]) return message.channel.send("There's already a sticky message in this channel.").then(msg => msg.delete({timeout: 5000}));
        let sentMessage = await message.channel.send(`:warning: __***Sticky Message, Read Before Typing!***__ :warning:\n${yeahIChangedTheVariableSoThisIsNotStolenLol}`);
        stickiesJson[message.channel.id] = {
            lastId: sentMessage.id,
            message: yeahIChangedTheVariableSoThisIsNotStolenLol.replace(/'/g, "’")
        };
        fs.writeFile("./db/stickymessages.json", JSON.stringify(stickiesJson), (err) => {
            if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating stickymessages.json file. See below error for details\n${err}`);
        });
    }
};

module.exports.help = {
    name: "createsticky",
    name2: "cs",
    category: 4,
    perm: 2,
    description: "Create a sticky message in the executing channel.",

}