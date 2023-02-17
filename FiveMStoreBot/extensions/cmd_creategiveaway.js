// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

const giveawayConfig = {
    emoji: "🎉",
}

module.exports.run = async (bot, message, args, connection) => {
    var ansChannel = "";
    var ansTags = "";
    var ansPrize = "";
    var anscustMsg = "na";
    var ansDuration = "";
    var ansWinners = "";
    var ansImage = "";
    var setEmoji = giveawayConfig.emoji;
    let everyoneRole = message.guild.roles.cache.find(role => role.name === "@everyone");
    let permissionOverwriteArray = [
        {
            id: message.author.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
        },
        {
            id: everyoneRole.id,
            deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
        },
    ]
    message.guild.channels.create(`create-giveaway`, {
        type: 'text', 
        permissionOverwrites: permissionOverwriteArray
    }).then(channy => {
        message.channel.send(`${message.author}, giveaway creation started. - <#${channy.id}>`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
        const filter = m => m.author.id === message.author.id;
        const q = new Discord.MessageEmbed()
        .setColor(config["bot_setup"].feature_color)
        .setDescription(`**What channel would you like to publish the giveaway?**`)
        channy.send(q).then(daMessage => {
            daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                // console.log(ans.first().mentions.channels.first().id)
                if(ans.first().mentions.channels.first()) {
                    ansChannel = ans.first().mentions.channels.first().id;
                } else {
                    ansChannel = ans.first().content;
                }
            }).then(msg2 => {
                const q = new Discord.MessageEmbed()
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**What roles/users would you like to mention?** Use \`NA\` to not tag.`)
                channy.send(q).then(daMessage => {
                    daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                        ansTags = ans.first().content;
                    }).then(msg2 => {
                        const q = new Discord.MessageEmbed()
                        .setColor(config["bot_setup"].feature_color)
                        .setDescription(`**What is the prize?**`)
                        channy.send(q).then(daMessage => {
                            daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                ansPrize = ans.first().content;
                            }).then(msg2 => {
                                const q = new Discord.MessageEmbed()
                                .setColor(config["bot_setup"].feature_color)
                                .setDescription(`**Set a custom winning message.** Example output: __Custom winning message [winners]__. Use \`NA\` to set to default.`)
                                channy.send(q).then(daMessage => {
                                    daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                        anscustMsg = ans.first().content;
                                    }).then(msg2 => {
                                        const q = new Discord.MessageEmbed()
                                        .setColor(config["bot_setup"].feature_color)
                                        .setDescription(`**How many winners would you like?**`)
                                        channy.send(q).then(daMessage => {
                                            daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                ansWinners = ans.first().content;
                                            }).then(msg2 => {
                                                const q = new Discord.MessageEmbed()
                                                .setColor(config["bot_setup"].feature_color)
                                                .setDescription(`**Image Link.** Place a image link that will be placed in the giveaway embed. Use \`NA\` to disable this.`)
                                                channy.send(q).then(daMessage => {
                                                    daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                        ansImage = ans.first().content;
                                                    }).then(msg2 => {
                                                        const q = new Discord.MessageEmbed()
                                                        .setColor(config["bot_setup"].feature_color)
                                                        .setDescription(`[Final Question Before Creation]\n**What duration do you want the giveaway to go for?** Eg; \`10m\`, \`1h\`, \`2d\`, \`1w\``)
                                                        channy.send(q).then(daMessage => {
                                                            daMessage.channel.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                ansDuration = ans.first().content;
                                                            }).then(async msg2 => {
                                                                let giveawaysJson = await JSON.parse(fs.readFileSync('./db/giveaways.json', "utf8"));
                                                                let giveawayId = message.id.charAt(0)+message.id.substr(message.id.length - 4);
                                                                let endTime = Date.now() + ms(ansDuration);
                                                                let daChannel = message.guild.channels.cache.get(ansChannel);
                                                                if(!daChannel) return channy.send(`Channel ID supplied can't be found.`).then(msg => msg.delete({timeout: 5000})).catch(console.error);

                                                                let embed = new Discord.MessageEmbed()
                                                                embed.setTitle(`${setEmoji} GIVEAWAY ${setEmoji}`)
                                                                embed.setColor(config["bot_setup"].feature_color)
                                                                embed.setDescription(`React with ${setEmoji} to enter this giveaway!\n\n**Prize:** ${ansPrize}\n**Winners:** ${ansWinners}\n**Hosted by:** ${message.author}\n**Time remaining:** ${ms(endTime - Date.now(), {long: true})}`)
                                                                embed.setFooter(`ID: ${giveawayId}`);
                                                                if(ansImage.toLowerCase() !== "na") {
                                                                    embed.setImage(ansImage)
                                                                }
                                                                if(ansTags.toLowerCase() !== "na") {
                                                                    daChannel.send(`${ansTags}`).then(msg => msg.delete({timeout: ms('30m')})).catch(console.error);
                                                                }
                                                                daChannel.send(embed).then(emMsg => {
                                                                    emMsg.react(setEmoji);
                                                                    giveawaysJson[giveawayId] = {
                                                                        active: true,
                                                                        prize: ansPrize,
                                                                        emoji: setEmoji,
                                                                        winners: Number(ansWinners),
                                                                        author: message.author.id,
                                                                        endTime: endTime,
                                                                        totalTime: ms(ansDuration),
                                                                        giveawayIDs: [message.guild.id, emMsg.id, ansChannel],
                                                                        image: ansImage,
                                                                        finalArray: [],
                                                                        winnersArray: [],
                                                                        winMsg: anscustMsg
                                                                    }
                                                                    fs.writeFile("./db/giveaways.json", JSON.stringify(giveawaysJson), (err) => {
                                                                        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating giveaways.json file. See below error for details\n${err}`);
                                                                    });
                                                                    channy.send(`Created - <#${ansChannel}>`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
                                                                    setTimeout(async () => {
                                                                        channy.delete()
                                                                    }, 8000);
                                                                }).catch(console.error);
                                                            }).catch(console.error);
                                                        }).catch(console.error);
                                                    }).catch(console.error);
                                                }).catch(console.error);
                                            }).catch(console.error);
                                        }).catch(console.error);
                                    }).catch(console.error);
                                }).catch(console.error);
                            }).catch(console.error);
                        }).catch(console.error);
                    }).catch(console.error);
                }).catch(console.error);
            }).catch(console.error);
        }).catch(console.error);
    });
};

module.exports.help = {
    name: "gcreate",
    name2: "gc",
    category: 4,
    perm: 2,
    description: "Create a giveaway",

}