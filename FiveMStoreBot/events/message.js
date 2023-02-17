// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
spamFilter = {}

module.exports.run = async (bot, connection) => {
    bot.on("message", async message => {
        // Tick Archiver
        if(message.channel && message.guild && message.channel.type !== 'dm') {
            if(message.channel.name.startsWith(`ticket-`) && config["ticket_module"].enable_archive) {
                if(fs.existsSync(`./db/${message.channel.id}.json`)) {
                    let tickFile = JSON.parse(fs.readFileSync(`./db/${message.channel.id}.json`, "utf8"));
                    let daContent = "Fetching... Error";
                    if(message.embeds[0]) {
                        try {
                            daContent = `<span style="color: #7289da">[Bot Embedded Message]</span> ${message.embeds[0].description}`;
                        } catch(err){
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not get message embed from channel ${message.channel.name} (${message.channel.id}) with message ID ${message.id}`);
                            return
                        };  
                    } else {
                        daContent = message.content;
                    }
                    tickFile[message.id] = {
                        author: message.author.tag,
                        sentAt: message.createdAt.toString(),
                        content: daContent
                    };
                    fs.writeFile(`./db/${message.channel.id}.json`, JSON.stringify(tickFile, null, 4), (err) => {
                        if (err) console.log(err)
                    });
                }
            }
        }

        if (message.author.bot) return;

        if(config["dm_user_module"].enabled) {
            if(message.channel.type === "dm" && message.content.length < 2028) {
                if(config["dm_user_module"].use_embeds) {
                    const embed = new Discord.MessageEmbed()
                    .setColor(config["bot_setup"].feature_color)
                    .setAuthor(message.author.tag, message.author.avatarURL())
                    .setDescription(`**New DM:**\n${message.content}`)
                    .setTimestamp()
                    .setFooter(config["bot_setup"].copyright, bot.user.avatarURL());

                    config["dm_user_module"].log_bot_dms_channels.forEach(channelId => {
                        let channel = bot.channels.cache.get(channelId);
                        if(!channel) {
                            console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'log_bot_dms_channels'. Please check your configured channel ID's.`)
                        } else {
                            channel.send(embed).catch();
                        }
                    });
                } else {
                    config["dm_user_module"].log_bot_dms_channels.forEach(channelId => {
                        let channel = bot.channels.cache.get(channelId);
                        if(!channel) {
                            console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'log_bot_dms_channels'. Please check your configured channel ID's.`)
                        } else {
                            channel.send(`**New DM message from \`${message.author.tag}\`:**\n${message.content}`).catch();
                        }
                    });
                }
            }
        }
        if(message.channel.type === 'dm') return;
        if (!message.guild) return;

        if(config["admin_management"].enable_user_statistics) {
            let prefixPresent = false;
            let prefixes = config["bot_setup"].prefix;
            for(const aPrefix of prefixes) {
                if(message.content.startsWith(aPrefix)) prefixPresent = aPrefix;
            }
            if(!prefixPresent) {
                if(config["db_setup"].usedb) {
                    connection.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, function (err, resultChat) {
                        if(resultChat[0]) {
                            connection.query(`UPDATE users SET msgs = msgs + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                                if (error) throw error;
                                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${message.author.tag}) users database table updated.`);
                            });
                        } else {
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not find user (${message.author.tag}) users database row. Creating one instead.`);
                            connection.query(`INSERT INTO users (id, joins, kicks, bans, mutes, msgs, delmsgs, actkicks, actbans, actwarns, actmutes) VALUES ('${message.author.id}', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0)`, function (err, result) {
                                if (err) throw err;
                            });
                        }
                    });
                } else {
                    let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
                    if(!usersJson[message.author.id]) {
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not find user (${message.author.tag}) users JSON row. Creating one instead.`);
                        usersJson[message.author.id] = {
                            joins: 1,
                            kicks: 0,
                            bans: 0,
                            mutes: 0,
                            msgs: 0,
                            delmsgs: 0,
                            actkicks: 0,
                            actbans: 0,
                            actwarns: 0,
                            actmutes: 0
                        };
                    } else {
                        usersJson[message.author.id].msgs = ++usersJson[message.author.id].msgs;
                    }
                    fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
                    });
                }
            }
        }

        if(config["language_module"].enabled) {
            config["language_module"].filter_words.forEach(eachWord => {
                if(message.content.toLowerCase().search(eachWord.toLowerCase()) >= 0) {
                    if(!message.member.roles.cache.some(r=>config["language_module"].bypass_roles.includes(r.id)) ) {
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag}'s message was deleted because it contained a blacklisted word (${eachWord}).`)
                        message.delete();
                        message.channel.send(`Your message contains a restricted term (||${eachWord}||). Message deleted.`).then(msg => msg.delete({timeout: 8000})).catch(console.error);
                    }
                }
            });
        }

        if(config["auto_response_messages"].enabled) {
            if(config["auto_response_messages"].ignore_tickets && message.channel.name.startsWith(`ticket-`)) {
                // Do nothing
            } else {
                config["auto_response_messages"].messages.forEach(element => {
                    if(element.contains) {
                        if(message.content.toLowerCase().search(element.content.toLowerCase()) >= 0) {
                            message.channel.send(element.reply);
                            if(element.deleteOP) message.delete();
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag}'s message auto replied as it contained required content (${element.content}).`)
                        }
                    } else {
                        if(message.content.toLowerCase() == element.content.toLowerCase()) {
                            message.channel.send(element.reply);
                            if(element.deleteOP) message.delete();
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag}'s message auto replied as it contained required content (${element.content}).`)
                        }
                    }
                });
            }
        }

        if(config["leveling_module"].enabled) {
            let xpToAdd = Math.floor(Math.random() * 7) + 3;
            if(config["leveling_module"].gain_extra_xp_from_attachments) {
                if(message.attachments.size > 0) {
                    xpToAdd = xpToAdd + config["leveling_module"].amount_added_from_attachments;
                }
            }
            if(config["leveling_module"].gain_extra_xp_from_longer_messages) {
                if(message.content.length > 800) {
                    xpToAdd = xpToAdd + config["leveling_module"].amount_added_from_longer_messages;
                }
            }


            if(config["db_setup"].usedb) {
                connection.query(`SELECT * FROM chatlvl WHERE id = '${message.author.id}'`, function (err, resultChat) {
                    if(resultChat[0]) {
                        let curxp = resultChat[0].xp;
                        let curLvl = resultChat[0].lvl;
                        let nxtLvl = resultChat[0].lvl * 300;
                        let SQLAdd =  curxp + xpToAdd;

                        connection.query(`UPDATE chatlvl SET xp = ${SQLAdd} WHERE id = '${message.author.id}'`, (error, result) => {
                            if (error) throw error;
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${message.author.tag}) chatlvl database updated. ${xpToAdd}XP added.`);
                        })

                        if(nxtLvl <= resultChat[0].xp){
                            connection.query(`UPDATE chatlvl SET lvl = lvl + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                                if (error) throw error; 
                                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${message.author.tag}) chatlvl database updated. Level up to ${curLvl + 1}`);
                            })

                            if(config["leveling_module"].enable_level_up_messages) {
                                var levelUpMessage = config["leveling_module"].levelup_messages[Math.floor(Math.random() * config["leveling_module"].levelup_messages.length)];
                                
                                if(config["leveling_module"].enable_level_up_embeds) {
                                    const embed = new Discord.MessageEmbed()
                                    .setColor(config["bot_setup"].feature_color)
                                    .setDescription(`**${message.author}** ${levelUpMessage} \nNew level: ${curLvl + 1}`)
                                    message.channel.send(embed).then(msg => msg.delete({timeout: ms('2m')}));
                                } else {
                                    message.channel.send(`**${message.author}** ${levelUpMessage} \nNew level: ${curLvl + 1}`).then(msg => msg.delete({timeout: ms('2m')}));
                                }
                            }
                        }

                    } else {
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not find user (${message.author.tag}) chatlvl database row. Creating one instead.`);
                        connection.query(`INSERT INTO chatlvl (id, xp, lvl) VALUES ('${message.author.id}', 0, 1)`, function (err, result) {
                            if (err) throw err;
                        });
                    }
                });
            } else {
                let chatLvlJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));

                if(!chatLvlJson[message.author.id]) {
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not find user (${message.author.tag}) chatlvl JSON row. Creating one instead.`);
                    chatLvlJson[message.author.id] = {
                        xp: 0,
                        lvl: 1
                    };
                }
            
                chatLvlJson[message.author.id].xp = chatLvlJson[message.author.id].xp + xpToAdd;
                let nxtLvl = chatLvlJson[message.author.id].lvl * 300;

                if(nxtLvl <= chatLvlJson[message.author.id].xp){
                    chatLvlJson[message.author.id].lvl++;
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${message.author.tag}) chatlvl JSON updated. Level up to ${chatLvlJson[message.author.id].lvl + 1}`);
                    if(config["leveling_module"].enable_level_up_messages) {
                        var levelUpMessage = config["leveling_module"].levelup_messages[Math.floor(Math.random() * config["leveling_module"].levelup_messages.length)];
                        
                        if(config["leveling_module"].enable_level_up_embeds) {
                            const embed = new Discord.MessageEmbed()
                            .setColor(config["bot_setup"].feature_color)
                            .setDescription(`**${message.author}** ${levelUpMessage} \nNew level: ${chatLvlJson[message.author.id].lvl + 1}`)
                            message.channel.send(embed).then(msg => msg.delete({timeout: ms('2m')}));
                        } else {
                            message.channel.send(`**${message.author}** ${levelUpMessage} \nNew level: ${chatLvlJson[message.author.id].lvl + 1}`).then(msg => msg.delete({timeout: ms('2m')}));
                        }
                    }
                }
                fs.writeFile("./db/chatlvl.json", JSON.stringify(chatLvlJson, null, 4), (err) => {
                    if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating chatlvl.json file. See below error for details\n${err}`);
                });
            }
        }

        if(config["moderation_module"].anti_spam_filter) {
            if(spamFilter[message.channel.id]) {
                if(spamFilter[message.channel.id].times >= config["moderation_module"].spam_max_messages && message.content.toLowerCase() == spamFilter[message.channel.id].content) { // times is higher and content is the same.
                    message.delete()
                    message.channel.send(`${message.author}, ${config["moderation_module"].anti_spam_reply}`).then(msg => msg.delete({timeout: 90000}));
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0m${message.author.tag}'s message was deleted because it classed as spam (${spamFilter[message.channel.id].content}).`)
                } else if(message.content.toLowerCase() == spamFilter[message.channel.id].content) { // message is the same but count is not high enough. Lets up it.
                    let daTimes = spamFilter[message.channel.id].times + 1;
                    spamFilter[message.channel.id] = {
                        times: daTimes,
                        msgId: message.id,
                        content: message.content.toLowerCase()
                    }
                } else { // Message is not the same. So lets log it.
                    spamFilter[message.channel.id] = {
                        times: 1,
                        msgId: message.id,
                        content: message.content.toLowerCase()
                    }
                }
            } else { // No filter log for this channel yet. So lets log it.
                spamFilter[message.channel.id] = {
                    times: 1,
                    msgId: message.id,
                    content: message.content.toLowerCase()
                }
            }
        }
    });
};