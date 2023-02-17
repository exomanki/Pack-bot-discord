// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, connection) => {
    bot.on('message', async (message) => {
        if (message.author.id == bot.user.id) return;
        if(!message.guild) return
        let stickiesJson = await JSON.parse(fs.readFileSync('./db/stickymessages.json', "utf8"));
        if(config["db_setup"].usedb) {
            connection.query(`SELECT * FROM stickymessages WHERE channelId = '${message.channel.id}'`, async function (err, resultChat) {
                if(resultChat[0]) {
                    let lastMessage = await message.channel.messages.fetch(resultChat[0].lastId);
                    if(!lastMessage) console.log(`\x1b[93m[Debug] \x1b[0mSticky message lastId message not found. Was it deleted?`);
                    lastMessage.delete();
                    let newMessage = await message.channel.send(`:warning: __***Sticky Message, Read Before Typing!***__ :warning:\n${resultChat[0].message}`);
                    connection.query(`UPDATE stickymessages SET lastId = '${newMessage.id}' WHERE channelId = '${message.channel.id}'`, (error, result) => {
                        if (error) throw error;
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mSticky messages database updated with new lastId.`);
                    });
                }
            });
        } else {
            if(stickiesJson[message.channel.id]) {
                let lastMessage = await message.channel.messages.fetch(stickiesJson[message.channel.id].lastId);
                if(!lastMessage) console.log(`\x1b[93m[Debug] \x1b[0mSticky message lastId message not found. Was it deleted?`);
                lastMessage.delete();
                // AUTO
                let newMessage = await message.channel.send(`:warning: __***Sticky Message, Read Before Typing!***__ :warning:\n${stickiesJson[message.channel.id].message}`);
        
                stickiesJson[message.channel.id] = {
                    lastId: newMessage.id,
                    message: stickiesJson[message.channel.id].message
                };
                fs.writeFile("./db/stickymessages.json", JSON.stringify(stickiesJson), (err) => {
                    if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating stickymessages.json file. See below error for details\n${err}`);
                });
            }
        }
    });
};