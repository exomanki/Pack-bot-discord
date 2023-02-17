// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, connection) => {
    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            return false
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }

    bot.on('ready', () => {
        setInterval(async () => {
            let giveawaysJson = await JSON.parse(fs.readFileSync('./db/giveaways.json', "utf8"));
            for(const item in giveawaysJson) {
                if(giveawaysJson[item].active) {
                    var daGuild = bot.guilds.cache.get(giveawaysJson[item].giveawayIDs[0]);
                    // Debug: AUTO
                    var daChannel = daGuild.channels.cache.get(giveawaysJson[item].giveawayIDs[2]);
                    // var daMessage = daChannel.messages.fetch(giveawaysJson[item].giveawayIDs[1], {force: true});
                    var setEmoji = giveawaysJson[item].emoji
                    if(Date.now() >= giveawaysJson[item].endTime) {
                        // Announce Winner
                        daChannel.messages.fetch(giveawaysJson[item].giveawayIDs[1]).then(msg => {
                            let thaFetch = msg.reactions.cache.first().users.fetch();
                            let totalReactions = msg.reactions.cache.first().count;
                            thaFetch.then(function(thaFetchReturn) {
                                let reactionsArray = Array.from(thaFetchReturn.keys());
                                reactionsArray.splice(reactionsArray.indexOf(bot.user.id), 1);
                                reactionsArray.splice(reactionsArray.indexOf(giveawaysJson[item].author), 1);
                                const winners = getRandom(reactionsArray, giveawaysJson[item].winners);
                                if(!winners) {
                                    let embed = new Discord.MessageEmbed()
                                    embed.setTitle(`${setEmoji} GIVEAWAY ${setEmoji}`)
                                    embed.setColor(config["bot_setup"].feature_color)
                                    embed.setDescription(`React with ${setEmoji} to enter this giveaway!\n\n**Prize:** ${giveawaysJson[item].prize}\n**Winners:** ${giveawaysJson[item].winners}\n**Hosted by:** <@${giveawaysJson[item].author}>\n**Time remaining:** OVERDUE - Awaiting more entires to complete giveaway!`)
                                    embed.setFooter(`ID: ${item}`);
                                    if(giveawaysJson[item].image.toLowerCase() !== "na") {
                                        embed.setImage(giveawaysJson[item].image)
                                    }
                                    daChannel.messages.fetch(giveawaysJson[item].giveawayIDs[1]).then(msg => {
                                        msg.edit(embed)
                                    });
                                } else {
                                    let index = 0;
                                    var winnersString = ""
                                    winners.forEach(eboy => {
                                        index++;
                                        if(index == 1) {
                                            winnersString += `<@${eboy}>`;
                                        } else {
                                            winnersString += `, <@${eboy}>`;
                                        }
                                    });
                                    // Delete old message
                                    msg.delete();
                                    // Announce Winner
                                    if(giveawaysJson[item].winMsg.toLowerCase() !== "na") {
                                        daChannel.send(`>>> :tada: **${giveawaysJson[item].winMsg} ${winnersString}** :tada:\nYou won the __${giveawaysJson[item].prize}__.\nTotal Entires: \`${totalReactions}\` • Duration: \`${ms(giveawaysJson[item].totalTime, {long: true})}\` • ID: \`${item}\``).catch(console.error);
                                    } else {
                                        daChannel.send(`>>> :tada: **Congratulations ${winnersString}** :tada:\nYou won the __${giveawaysJson[item].prize}__.\nTotal Entires: \`${totalReactions}\` • Duration: \`${ms(giveawaysJson[item].totalTime, {long: true})}\` • ID: \`${item}\``).catch(console.error);
                                    }
                                        giveawaysJson[item].active = false;
                                    giveawaysJson[item].finalArray = reactionsArray;
                                    giveawaysJson[item].winnersArray = winners;
                                    fs.writeFile("./db/giveaways.json", JSON.stringify(giveawaysJson), (err) => {
                                        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating giveaways.json file. See below error for details\n${err}`);
                                    });
                                }
                            })
                        });
                    } else {
                        // Update Existing Giveaway
                        let timeRemaining = ms(giveawaysJson[item].endTime - Date.now(), {long: true})
                        if(giveawaysJson[item].endTime - Date.now() < 3600000) { // 3600000 = 1h
                            timeRemaining = `around ${ms(giveawaysJson[item].endTime - Date.now(), {long: true})}`
                        }

                        let embed = new Discord.MessageEmbed()
                        embed.setTitle(`${setEmoji} GIVEAWAY ${setEmoji}`)
                        embed.setColor(config["bot_setup"].feature_color)
                        embed.setDescription(`React with ${setEmoji} to enter this giveaway!\n\n**Prize:** ${giveawaysJson[item].prize}\n**Winners:** ${giveawaysJson[item].winners}\n**Hosted by:** <@${giveawaysJson[item].author}>\n**Time remaining:** ${timeRemaining}`)
                        embed.setFooter(`ID: ${item}`);
                        if(giveawaysJson[item].image.toLowerCase() !== "na") {
                            embed.setImage(giveawaysJson[item].image)
                        }
                        daChannel.messages.fetch(giveawaysJson[item].giveawayIDs[1]).then(msg => {
                            msg.edit(embed)
                        });
                    }
                }
            }
        }, 60000);
    });
};