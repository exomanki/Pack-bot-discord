// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const toggleServerLockDown = require("./serverlock.js")

module.exports.run = async (bot, message, args, connection) => {
    toggleServerLockDown.data.toggleServerLockDown(message.channel);
};

module.exports.help = {
    name: "serverlock",
    category: 4,
    perm: 2,
    description: "Toggle a server lockdown, kicking joining users.",

}