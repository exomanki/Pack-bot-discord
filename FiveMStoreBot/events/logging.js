// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, connection) => {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    if(config["logging_module"].enable_deleted_messages_logging) {
        bot.on("messageDelete", async message => {
            if(message.channel.type === 'dm') return;
            if (!message.guild) return;
            if (message.content.length > 1023) return;
            if(message.author.bot) return;
            let prefixPresent = false;
            let prefixes = config["bot_setup"].prefix;
            for(const aPrefix of prefixes) {
                if(message.content.startsWith(aPrefix)) prefixPresent = aPrefix;
            }
            if(prefixPresent) return;
                
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription("**Action:** Message Deleted")
                .addField("Message Author", `${message.author.toString()} - ID: ${message.author.id}`)
                .addField("Channel", message.channel)
                .addField("Message Content", `${message.content}.`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].deleted_messages_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'deleted_messages_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });

            if(config["admin_management"].enable_user_statistics) {
                if(config["db_setup"].usedb) {
                    connection.query(`SELECT * FROM users WHERE id = '${message.author.id}'`, function (err, resultChat) {
                        if(resultChat[0]) {
                            connection.query(`UPDATE users SET delmsgs = delmsgs + 1 WHERE id = '${message.author.id}'`, (error, result) => {
                                if (error) throw error;
                                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${message.author.tag}) users database table updated.`);
                            });
                        }
                    });
                } else {
                    let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
                    if(usersJson[message.author.id]) {
                        usersJson[message.author.id].delmsgs = ++usersJson[message.author.id].delmsgs;
                    }
                    fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
                    });
                }
            }
        });
    }
    if(config["logging_module"].enable_edited_messages_logging) {
        bot.on("messageUpdate", async (oldMessage, newMessage) => {
            if(oldMessage == newMessage) return;
            if(oldMessage.author.bot) return;
            if(oldMessage.content.length > 1020) return;
            if(newMessage.content.length > 1020) return;
            if(!oldMessage.guild) return;

            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription("**Action:** Message Edited")
                .addField("Message Author", `${oldMessage.author.toString()} - ID: ${oldMessage.author.id}`)
                .addField("Channel", oldMessage.channel)
                .addField("Old Content", `${oldMessage.content}.`)
                .addField("New Content", `${newMessage.content}.`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].edited_messages_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'edited_messages_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });
    }
    if(config["logging_module"].enable_channel_change_logging) {
        bot.on("channelCreate", async (channel) => {
            if(!channel.guild) return;
            const audit = await channel.guild.fetchAuditLogs({limit: 1, type: 'CHANNEL_CREATE'});
            const operationExecutor = audit.entries.first().executor;
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**Action:** Channel Created\n\n**\`${capitalizeFirstLetter(channel.type)}\`** channel <#${channel.id}> (ID: ${channel.id}) was created at pos **\`${channel.rawPosition}\`**.\nActioned by: ${operationExecutor} (${operationExecutor.id})`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].channel_change_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'channel_change_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });

        bot.on("channelDelete", async (channel) => {
            if(!channel.guild) return;
            const audit = await channel.guild.fetchAuditLogs({limit: 1, type: 'CHANNEL_DELETE'});
            const operationExecutor = audit.entries.first().executor;
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**Action:** Channel Deleted\n\n**\`${capitalizeFirstLetter(channel.type)}\`** channel **${channel.name}** (ID: ${channel.id}) was deleted.\nActioned by: ${operationExecutor} (${operationExecutor.id})`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].channel_change_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'channel_change_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });

        bot.on("channelUpdate", async (oldChannel, newChannel) => {
            if(!oldChannel.guild) return;
            const audit = await oldChannel.guild.fetchAuditLogs({limit: 1, type: 'CHANNEL_UPDATE'});
            const operationExecutor = audit.entries.first().executor;
            if(operationExecutor.bot) return
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**Action:** Channel Updated\n\n**\`${capitalizeFirstLetter(oldChannel.type)}\`** channel **${oldChannel.name}** (ID: ${oldChannel.id}) was updated.\nActioned by: ${operationExecutor} (${operationExecutor.id})`)
                .addField("Before Changes:", `**Name:** \`${oldChannel.name || 'null'}\`\n**Position:** \`${oldChannel.rawPosition || 'null'}\`\n**Topic:** \`${oldChannel.topic || 'null'}\`\n**RateLimit:** \`${oldChannel.rateLimitPerUser+'s' || '0'}\`\n**NSFW:** \`${oldChannel.nsfw || 'false'}\`\n**Category:** \`${oldChannel.parentID || 'null'}\`\n`)
                .addField("After Changes:", `**Name:** \`${newChannel.name || 'null'}\`\n**Position:** \`${newChannel.rawPosition || 'null'}\`\n**Topic:** \`${newChannel.topic || 'null'}\`\n**RateLimit:** \`${newChannel.rateLimitPerUser+'s' || '0'}\`\n**NSFW:** \`${newChannel.nsfw || 'false'}\`\n**Category:** \`${newChannel.parentID || 'null'}\`\n`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].channel_change_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'channel_change_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });
    }

    if(config["logging_module"].enable_role_change_logging) {
        bot.on("roleCreate", async (role) => {
            if(!role.guild) return;
            const audit = await role.guild.fetchAuditLogs({limit: 1, type: 'ROLE_CREATE'});
            const operationExecutor = audit.entries.first().executor;
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**Action:** Role Created\n\n**\`${role.name}\`** (ID: ${role.id}) was created.\nActioned by: ${operationExecutor} (${operationExecutor.id})`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].role_change_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'role_change_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });

        bot.on("roleDelete", async (role) => {
            if(!role.guild) return;
            const audit = await role.guild.fetchAuditLogs({limit: 1, type: 'ROLE_DELETE'});
            const operationExecutor = audit.entries.first().executor;
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**Action:** Role Deleted\n\n**\`${role.name}\`** (ID: ${role.id}) was deleted.\nActioned by: ${operationExecutor} (${operationExecutor.id})`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].role_change_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'role_change_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });

        bot.on("roleUpdate", async (oldRole, newRole) => {
            if(!oldRole.guild) return;
            const audit = await oldRole.guild.fetchAuditLogs({limit: 1, type: 'ROLE_UPDATE'});
            const operationExecutor = audit.entries.first().executor;
            const embed = new Discord.MessageEmbed()
                .setAuthor("Action Logs", bot.user.avatarURL())
                .setColor(config["bot_setup"].feature_color)
                .setDescription(`**Action:** Role Updated\n\n**\`${oldRole.name}\`** (ID: ${oldRole.id}) has been updated.\nActioned by: ${operationExecutor} (${operationExecutor.id})`)
                .addField("Before Changes:", `**Name:** \`${oldRole.name || 'No'}\`\n**Position:** \`${oldRole.rawPosition || 'No'}\`\n**Display Separately:** \`${oldRole.hoist || 'No'}\`\n**Color:** \`${oldRole.color || 'No'}\`\n**Mentionable:** \`${oldRole.mentionable || 'No'}\`\n**Managed:** \`${oldRole.managed || 'No'}\`\n`)
                .addField("After Changes:", `**Name:** \`${newRole.name || 'No'}\`\n**Position:** \`${newRole.rawPosition || 'No'}\`\n**Display Separately:** \`${newRole.hoist || 'No'}\`\n**Color:** \`${newRole.color || 'No'}\`\n**Mentionable:** \`${newRole.mentionable || 'No'}\`\n**Managed:** \`${newRole.managed || 'No'}\`\n`)
                .setTimestamp()
                .setFooter(config["bot_setup"].copyright);
            
            config["logging_module"].role_change_channels.forEach(channelId => {
                let channel = bot.channels.cache.get(channelId);
                if(!channel) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'role_change_channels'. Please check your configured channel ID's.`)
                } else {
                    channel.send(embed).catch();
                }
            });
        });

        bot.on("guildBanAdd", async (guild, user) => {
            if(config["admin_management"].enable_user_statistics) {
                if(config["db_setup"].usedb) {
                    connection.query(`SELECT * FROM users WHERE id = '${user.id}'`, function (err, resultChat) {
                        if(resultChat[0]) {
                            connection.query(`UPDATE users SET bans = bans + 1 WHERE id = '${user.id}'`, (error, result) => {
                                if (error) throw error;
                                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0musers database table updated.`);
                            });
                        }
                    });
                } else {
                    let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
                    if(usersJson[user.id]) {
                        usersJson[user.id].bans = ++usersJson[user.id].bans;
                    }
                    fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
                    });
                }
            }
        });
    }
};