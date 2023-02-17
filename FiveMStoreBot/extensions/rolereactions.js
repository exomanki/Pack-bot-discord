// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const reactionConfig = {
    enabled: true,
    reactions: [
        {messageId: "741237138653184020", emojiName: "pinpng", action: 3, role: "741237371617411073"},
        {messageId: "741237160975532092", emojiName: "✅", action: 1, role: "741237374192975902"},
        {messageId: "741237183549145109", emojiName: "❌", action: 2, role: "741237374192975902"}
    ]
}

module.exports.run = async (bot, connection) => {
    if(reactionConfig.enabled) {
        bot.on("messageReactionAdd", async (reaction, user) => {
            if(!user) return;
            if(user.bot) return;
            if(!reaction.message.channel.guild) return;
            reactionConfig.reactions.forEach(daReaction => {
                if(reaction.message.id == daReaction.messageId && reaction.emoji.name == daReaction.emojiName) {
                    let role = reaction.message.channel.guild.roles.cache.get(daReaction.role);
                    if(!role) {
                        return console.log(`\x1b[91m[ALERT] \x1b[0mRole (${daReaction.role}) not found for 'reactions.role'. Please check your configured role ID's.`)
                    }
                    if(daReaction.action == 3) {
                        if(!reaction.message.guild.member(user).roles.cache.has(role.id)) {
                            reaction.message.guild.member(user).roles.add(role).catch(console.error);
                        } else {
                            reaction.message.guild.member(user).roles.remove(role).catch(console.error);
                        }                
                    } else if(daReaction.action == 2) {
                        // AUTO
                        reaction.message.guild.member(user).roles.remove(role).catch(console.error);
                    } else {
                        reaction.message.guild.member(user).roles.add(role).catch(console.error);
                    }
                    reaction.users.remove(user);
                }
            });
        });
    }
};