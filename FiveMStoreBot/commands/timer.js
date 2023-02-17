// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args, connection) => {
    let timer = args[0];
    if(!args[0]) return message.channel.send(`Please enter a period of time, with either \`s, m or h\` at the end!`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    message.channel.send(":white_check_mark: Timer has been set for: " + `${ms(ms(timer), {long: true})}`)
    setTimeout(function(){
        message.reply(`Timer has ended, it lasted \`${ms(ms(timer), {long: true})}\``)
    }, ms(timer));
};

module.exports.help = {
    name: "timer",
    category: 2,
    perm: 4,
    description: "Set a timer for an amount of time.",

}