// Created by -MeTi-
const config = require("./../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const Canvas = require('canvas');
const { registerFont, createCanvas } = require('canvas');
registerFont('./db/ChronicaPro-Black.ttf', { family: 'ChronicaPro-Black' })
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px ChronicaPro-Black`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

module.exports.run = async (bot, connection) => {
    bot.on('guildMemberAdd', async member => {

        if(config["db_setup"].usedb) {
            connection.query(`SELECT * FROM offlinebans where id = '${member.id}' OR id = '${member.user.tag}'`, async (err, results) => {
                if(results[0]) {
                    if(config["moderation_module"].dm_banned_user) {
                        try{
                            await member.send(`**Notification**\nThis is a notification to say that you have been banned from __${message.guild.name}__ for the following reason(s):\n${results[0].reason}`);
                        }catch(e){
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${member.user.tag}). Their DMs might be locked.`);
                        }
                    }
                    connection.query(`DELETE FROM offlinebans WHERE id = '${member.id}' OR id = '${member.user.tag}'`, (error, result) => {
                        if (error && config["bot_setup"].debug_mode) throw error;
                    })
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mBanned (${member.user.tag}) as they were banned via ID while not in the Discord.`);
                    return member.ban({reason: results[0].reason});
                }
            });
        } else {
            let offlineBansJson = await JSON.parse(fs.readFileSync('./db/offlinebans.json', "utf8"));
            if(offlineBansJson[member.id] || offlineBansJson[member.user.tag]) {
                let reason = 'N/A'
                if(offlineBansJson[member.id]) {
                    reason = offlineBansJson[member.id].reason;
                    delete offlineBansJson[member.user.id];
                } else if(offlineBansJson[member.user.tag]) {
                    reason = offlineBansJson[member.user.tag].reason;
                    delete offlineBansJson[member.user.tag];
                }

                if(config["moderation_module"].dm_banned_user) {
                    try{
                        await member.send(`**Notification**\nThis is a notification to say that you have been banned from __${message.guild.name}__ for the following reason(s):\n${reason}`);
                    }catch(e){
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not DM user (${member.user.tag}). Their DMs might be locked.`);
                    }
                }
                fs.writeFile("./db/offlinebans.json", JSON.stringify(offlineBansJson, null, 4), (err) => {
                    if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating offlinebans.json file. See below error for details\n${err}`);
                });
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mBanned (${member.user.tag}) as they were banned via ID while not in the Discord.`);
                return member.ban({reason: reason});
            }
        }
        
        if(config["greet_module"].enabled) {
            if(config["greet_module"].display_setting == 2) {
                const embed = new Discord.MessageEmbed()
                    .setColor(config["bot_setup"].feature_color)
                    .setTitle('Welcome User!')
                    .setThumbnail(member.user.avatarURL({dynamic: true}))
                    .setDescription(`${member} (${member.user.tag})\n${config["greet_module"].welcome_message}`)
                    .setTimestamp()
                    .setFooter(config["bot_setup"].copyright);
                
                config["greet_module"].welcome_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'welcome_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send(embed).catch();
                    }
                });
            } else if(config["greet_module"].display_setting == 3) {
                const canvas = Canvas.createCanvas(700, 250);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage('./db/greetimg.png');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(0,0,0,0.0)';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
                ctx.font = '24px ChronicaPro-Black';
                ctx.fillStyle = '#eeeeee';
                ctx.fillText(`Welcome,`, canvas.width / 2.5, canvas.height / 2.5);
                ctx.font = '20px ChronicaPro-Black';
                ctx.fillText(`${config["greet_module"].welcome_message}`, canvas.width / 2.5, canvas.height / 1.3);
                ctx.font = applyText(canvas, `${member.user.tag}!`);
                ctx.fillStyle = '#eeeeee';
                ctx.fillText(`${member.user.tag}`, canvas.width / 2.5, canvas.height / 1.6);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(member.user.avatarURL({format: 'png'}));
                ctx.drawImage(avatar, 25, 25, 200, 200);
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'xp.png');
                config["greet_module"].welcome_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'welcome_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send({
                            files: [attachment]
                        });
                    }
                });
            } else {
                config["greet_module"].welcome_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'welcome_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send(`${member} (${member.user.tag}) ${config["greet_module"].welcome_message}`).catch();
                    }
                });
            }
        }
        if(config["auto_role_module"].enabled) {
            config["auto_role_module"].join_roles.forEach(roleId => {
                let role = member.guild.roles.cache.get(roleId);
                if(!role) {
                    console.log(`\x1b[91m[ALERT] \x1b[0mRole (${roleId}) not found for 'join_roles'. Please check your configured role ID's.`)
                } else {
                    member.roles.add(role).catch(console.error);
                }
            });
        }

        if(config["utility_module"].member_count_channel_enabled) {
            let channel = bot.channels.cache.get(config["utility_module"].member_count_channel);
            if(!channel) {
                console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channel}) not found for 'member_count_channel'. Please check your configured channel ID's.`)
            } else {
                channel.setName(`Members: ${member.guild.memberCount}`);
            }
        }

        if(config["admin_management"].enable_user_statistics) {
            if(config["db_setup"].usedb) {
                connection.query(`SELECT * FROM users WHERE id = '${member.id}'`, function (err, resultChat) {
                    if(resultChat[0]) {
                        connection.query(`UPDATE users SET joins = joins + 1 WHERE id = '${member.id}'`, (error, result) => {
                            if (error) throw error;
                            if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${member.user.tag}) users database table updated.`);
                        });
                    } else {
                        if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not find user (${member.user.tag}) users database row. Creating one instead.`);
                        connection.query(`INSERT INTO users (id, joins, kicks, bans, mutes, msgs, delmsgs, actkicks, actbans, actwarns, actmutes) VALUES ('${member.id}', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0)`, function (err, result) {
                            if (err) throw err;
                        });
                    }
                });
            } else {
                let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
                if(!usersJson[member.id]) {
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCould not find user (${member.user.tag}) users JSON row. Creating one instead.`);
                    usersJson[member.id] = {
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
                    usersJson[member.id].msgs = ++usersJson[member.id].joins;
                }
                fs.writeFile("./db/users.json", JSON.stringify(usersJson, null, 4), (err) => {
                    if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating users.json file. See below error for details\n${err}`);
                });
            }
        }
    });

    bot.on('guildMemberRemove', async member => {
        if(config["greet_module"].enabled) {
            if(config["greet_module"].display_setting == 2) {
                const embed = new Discord.MessageEmbed()
                    .setColor(config["bot_setup"].feature_color)
                    .setTitle('Goodbye User!')
                    .setThumbnail(member.user.avatarURL({dynamic: true}))
                    .setDescription(`${member} (${member.user.tag})\n${config["greet_module"].leave_message}`)
                    .setTimestamp()
                    .setFooter(config["bot_setup"].copyright);
                
                config["greet_module"].leave_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'leave_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send(embed).catch();
                    }
                });
            } else if(config["greet_module"].display_setting == 3) {
                const canvas = Canvas.createCanvas(700, 250);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage('./db/greetimg.png');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(0,0,0,0.0)';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
                ctx.font = '24px ChronicaPro-Black';
                ctx.fillStyle = '#eeeeee';
                ctx.fillText(`Goodbye,`, canvas.width / 2.5, canvas.height / 2.5);
                ctx.font = '20px ChronicaPro-Black';
                ctx.fillText(`${config["greet_module"].leave_message}`, canvas.width / 2.5, canvas.height / 1.3);
                ctx.font = applyText(canvas, `${member.user.tag}!`);
                ctx.fillStyle = '#eeeeee';
                ctx.fillText(`${member.user.tag}`, canvas.width / 2.5, canvas.height / 1.6);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(member.user.avatarURL({format: 'png'}));
                ctx.drawImage(avatar, 25, 25, 200, 200);
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'xp.png');
                config["greet_module"].leave_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'leave_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send({
                            files: [attachment]
                        });
                    }
                });
            } else {
                config["greet_module"].leave_channels.forEach(channelId => {
                    let channel = bot.channels.cache.get(channelId);
                    if(!channel) {
                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'leave_channels'. Please check your configured channel ID's.`)
                    } else {
                        channel.send(`${member} (${member.user.tag}) ${config["greet_module"].leave_message}`).catch();
                    }
                });
            }
        }
        if(config["leveling_module"].remove_levels_on_leave) {
            if(config["db_setup"].usedb) {
                connection.query(`DELETE FROM chatlvl WHERE id = '${member.user.id}'`, (error, result) => {
                    if (error) throw error;
                    if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${member.user.tag}) had their chat level removed as they left.`);
                })
            } else {
                let chatLvlJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));
                if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mUser (${member.user.tag}) had their chat level removed as they left.`);
                if(chatLvlJson[member.user.id]) {
                    delete chatLvlJson[member.user.id];
                    fs.writeFile("./db/chatlvl.json", JSON.stringify(chatLvlJson, null, 4), (err) => {
                        if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating chatlvl.json file. See below error for details\n${err}`);
                    });
                }
            }
        }

        if(config["utility_module"].member_count_channel_enabled) {
            let channel = bot.channels.cache.get(config["utility_module"].member_count_channel);
            if(!channel) {
                console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channel}) not found for 'member_count_channel'. Please check your configured channel ID's.`)
            } else {
                channel.setName(`Members: ${member.guild.memberCount}`);
            }
        }
    });
};