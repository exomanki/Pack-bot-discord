// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");
const flags = {
    DISCORD_EMPLOYEE: 'Discord Employee',
    DISCORD_PARTNER: 'Discord Partner',
    BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
    BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
    HYPESQUAD_EVENTS: 'HypeSquad Events',
    HOUSE_BRAVERY: 'House of Bravery',
    HOUSE_BRILLIANCE: 'House of Brilliance',
    HOUSE_BALANCE: 'House of Balance',
    EARLY_SUPPORTER: 'Early Supporter',
    TEAM_USER: 'Team User',
    SYSTEM: 'System',
    VERIFIED_BOT: 'Verified Bot',
    VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

module.exports.run = async (bot, message, args, connection) => {
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!mentionedUser) return message.channel.send(`You must provide a user.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
    if(mentionedUser.user.bot) return message.channel.send(`You can't check bots.`).then(msg => msg.delete({timeout: 8000})).catch(console.error);
    var slide = 1;
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    function genTrueFalse(val) {
        if(val) return 'Yes';
        if(!val) return 'No';
    }
    
    function convertStatus(statArray) {
        if(!statArray) return 'None';
        if(statArray.desktop) return 'Desktop';
        if(statArray.web) return 'Web Browser';
        if(statArray.mobile) return 'Mobile';
        return 'None'
    }
    setTimeout(async function(){
        const gMember = message.guild.member(mentionedUser);
        let userId = mentionedUser.user.id;
        let warningsJson = await JSON.parse(fs.readFileSync('./db/warnings.json', "utf8"));
        let chatJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));
        let usersJson = await JSON.parse(fs.readFileSync('./db/users.json', "utf8"));
        let returnArray = {}
        returnArray.warns = 0;
        returnArray.chatLvl = 0;
        returnArray.joins = 1;
        returnArray.kicks = 0;
        returnArray.bans = 0;
        returnArray.mutes = 0;
        returnArray.msgs = 0;
        returnArray.delmsgs = 0;
        returnArray.actkicks = 0;
        returnArray.actbans = 0;
        returnArray.actwarns = 0;
        returnArray.actmutes = 0;
        returnArray.isAdmin = false;

        if(config["db_setup"].usedb) {
            await connection.query(`SELECT COUNT(*) AS daCount FROM warnings where id = '${userId}'`, (err, results) => {
                if(results[0]) returnArray.warns = results[0].daCount;
            });
            await connection.query(`SELECT * FROM chatlvl where id = '${userId}'`, (err, results) => {
                if(results[0]) returnArray.chatLvl = results[0].lvl;
            });
            await connection.query(`SELECT * FROM users WHERE id = '${userId}'`, function (err, results) {
                if(results[0]) {
                    returnArray.joins = results[0].joins;
                    returnArray.kicks = results[0].kicks;
                    returnArray.bans = results[0].bans;
                    returnArray.mutes = results[0].mutes;
                    returnArray.msgs = results[0].msgs;
                    returnArray.delmsgs = results[0].delmsgs;
                    returnArray.actkicks = results[0].actkicks;
                    returnArray.actbans = results[0].actbans;
                    returnArray.actwarns = results[0].actwarns;
                    returnArray.actmutes = results[0].actmutes;
                }
            });


        } else {
            for(const key in warningsJson) {
                if (warningsJson[key].id == userId) {
                    returnArray.warns = ++returnArray.warns;
                }
            }
            if(chatJson[userId]) returnArray.chatLvl = chatJson[userId].lvl;
            if(usersJson[userId]) {
                returnArray.joins = usersJson[userId].joins;
                returnArray.kicks = usersJson[userId].kicks;
                returnArray.bans = usersJson[userId].bans;
                returnArray.mutes = usersJson[userId].mutes;
                returnArray.msgs = usersJson[userId].msgs;
                returnArray.delmsgs = usersJson[userId].delmsgs;
                returnArray.actkicks = usersJson[userId].actkicks;
                returnArray.actbans = usersJson[userId].actbans;
                returnArray.actwarns = usersJson[userId].actwarns;
                returnArray.actmutes = usersJson[userId].actmutes;
            }
        }

        let ownerPermArray = config["admin_management"].owner_roles;
        let adminPermArray = config["admin_management"].admin_roles;
        let staffPermArray = config["admin_management"].staff_roles;
        if(gMember.roles.cache.some(r=>staffPermArray.includes(r.id))) {
            returnArray.isAdmin = true;
        }
        if(gMember.roles.cache.some(r=>adminPermArray.includes(r.id))) {
            returnArray.isAdmin = true;
        }
        if(gMember.roles.cache.some(r=>ownerPermArray.includes(r.id))) {
            returnArray.isAdmin = true;
        }

        var tempString = ""
        if(config["db_setup"].usedb) {
            connection.query(`SELECT * FROM warnings where id = '${userId}'`, (err, results) => {
                if(results[0]) {
                    results.forEach(data => {
                        tempString += `\`#${data.wid}\` (${data.date}) ${data.reason}\n`
                    });
                }
            });
        } else {
            for(const key in warningsJson) {
                if (warningsJson[key].id == mentionedUser.user.id) {
                    tempString += `\`#${key}\` (${warningsJson[key].date}) ${warningsJson[key].reason}\n`
                }
            }
        }


        
        const userFlags = gMember.user.flags.toArray();

        setTimeout(async function(){
            let embed = new Discord.MessageEmbed()
                embed.setColor(config["bot_setup"].feature_color)
                embed.setTitle(`__${mentionedUser.user.username}'s__ Information`)
                embed.setThumbnail(mentionedUser.user.avatarURL({dynamic: true}))
                embed.addFields(
                    {name: 'Bot:', value: `\`${genTrueFalse(mentionedUser.user.bot)}\``, inline: true},
                    {name: 'Status:', value: `\`${capitalizeFirstLetter(mentionedUser.presence.status)}\``, inline: true},
                    {name: 'Device:', value: `\`${convertStatus(mentionedUser.presence.clientStatus)}\``, inline: true},
                    {name: 'Badge(s):', value: `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``, inline: true},
                    {name: 'Nickname:', value: `\`${mentionedUser.nickname ? mentionedUser.nickname : 'None'}\``, inline: true},
                    // {name: '\u200B', value: '\u200B'},
                    {name: 'User:', value: mentionedUser},
                    {name: 'Username:', value: `\`\`\`${mentionedUser.user.tag}\`\`\``},
                    {name: 'User ID:', value: `\`\`\`${mentionedUser.user.id}\`\`\``},

                    {name: 'Created Account At:', value: `\`\`\`${mentionedUser.user.createdAt.toLocaleString()}\`\`\``},
                    {name: 'Joined Guild At:', value: `\`\`\`${gMember.joinedAt.toLocaleString()}\`\`\``},

                    {name: '\u200B', value: '\u200B'},
                )
                if(returnArray.isAdmin) {
                    embed.addFields(  
                        {name: 'Warnings Issued:', value: `${returnArray.actwarns}`, inline: true},
                        {name: 'Kicks Issued:', value: `${returnArray.actkicks}`, inline: true},
                        {name: 'Bans Issued:', value: `${returnArray.actbans}`, inline: true}, 
                    )
                }
                embed.addFields(  
                    {name: 'Warning Count:', value: `${returnArray.warns}`, inline: true},
                    {name: 'Kick Count:', value: `${returnArray.kicks}`, inline: true},
                    {name: 'Ban Count:', value: `${returnArray.bans}`, inline: true}, 

                    {name: 'Mute Count:', value: `${returnArray.mutes}`, inline: true},
                    {name: 'Join Count:', value: `${returnArray.joins}`, inline: true},
                    {name: 'Booster:', value: `${genTrueFalse(mentionedUser.user.premiumSinceTimestamp)}`, inline: true},

                    {name: 'Message Count:', value: `${returnArray.msgs}`, inline: true},
                    {name: 'Deleted Messages:', value: `${returnArray.delmsgs}`, inline: true},
                    {name: 'Chat Level:', value: `${returnArray.chatLvl}`, inline: true},
                )
                embed.setTimestamp()
                embed.setFooter(`Requested by ${message.author.username} | ${config["bot_setup"].copyright}`, message.author.avatarURL());
            message.channel.send(embed).then(msg => {
                msg.react('⬅️').then(() => msg.react('➡️'));

                const filterE = (reaction, user) => {
                    return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                const collector = msg.createReactionCollector(filterE, {time: ms("1h")});

                collector.on('collect', reaction => {
                    if (reaction.emoji.name === '⬅️') {
                        UseSlideNumber(3);
                    }
                    if (reaction.emoji.name === '➡️') {
                        UseSlideNumber(2);
                    }

                    if(UseSlideNumber(1) == 1) {
                        let embed = new Discord.MessageEmbed()
                            embed.setColor(config["bot_setup"].feature_color)
                            embed.setTitle(`__${mentionedUser.user.username}'s__ Information`)
                            embed.setThumbnail(mentionedUser.user.avatarURL({dynamic: true}))
                            embed.addFields(
                                {name: 'Bot:', value: `\`${genTrueFalse(mentionedUser.user.bot)}\``, inline: true},
                                {name: 'Status:', value: `\`${capitalizeFirstLetter(mentionedUser.presence.status)}\``, inline: true},
                                {name: 'Device:', value: `\`${convertStatus(mentionedUser.presence.clientStatus)}\``, inline: true},
                                {name: 'Badge(s):', value: `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``, inline: true},
                                {name: 'Nickname:', value: `\`${mentionedUser.nickname ? mentionedUser.nickname : 'None'}\``, inline: true},
                                // {name: '\u200B', value: '\u200B'},
                                {name: 'User:', value: mentionedUser},
                                {name: 'Username:', value: `\`\`\`${mentionedUser.user.tag}\`\`\``},
                                {name: 'User ID:', value: `\`\`\`${mentionedUser.user.id}\`\`\``},
                
                                {name: 'Created Account At:', value: `\`\`\`${mentionedUser.user.createdAt.toLocaleString()}\`\`\``},
                                {name: 'Joined Guild At:', value: `\`\`\`${gMember.joinedAt.toLocaleString()}\`\`\``},
                
                                {name: '\u200B', value: '\u200B'},
                            )
                            if(returnArray.isAdmin) {
                                embed.addFields(  
                                    {name: 'Warnings Issued:', value: `${returnArray.actwarns}`, inline: true},
                                    {name: 'Kicks Issued:', value: `${returnArray.actkicks}`, inline: true},
                                    {name: 'Bans Issued:', value: `${returnArray.actbans}`, inline: true}, 
                                )
                            }
                            embed.addFields(  
                                {name: 'Warning Count:', value: `${returnArray.warns}`, inline: true},
                                {name: 'Kick Count:', value: `${returnArray.kicks}`, inline: true},
                                {name: 'Ban Count:', value: `${returnArray.bans}`, inline: true}, 
                
                                {name: 'Mute Count:', value: `${returnArray.mutes}`, inline: true},
                                {name: 'Join Count:', value: `${returnArray.joins}`, inline: true},
                                {name: 'Booster:', value: `${genTrueFalse(mentionedUser.user.premiumSinceTimestamp)}`, inline: true},
                
                                {name: 'Message Count:', value: `${returnArray.msgs}`, inline: true},
                                {name: 'Deleted Messages:', value: `${returnArray.delmsgs}`, inline: true},
                                {name: 'Chat Level:', value: `${returnArray.chatLvl}`, inline: true},
                            )
                        embed.setTimestamp()
                            embed.setFooter(`Requested by ${message.author.username} | ${config["bot_setup"].copyright}`, message.author.avatarURL());
                        msg.edit(embed)
                    } else if(UseSlideNumber(1) == 2) {
                        const embed = new Discord.MessageEmbed()
                            .setColor(config["bot_setup"].feature_color)
                            .setTitle(`__${mentionedUser.user.username}'s__ Warnings`)
                            .setThumbnail(mentionedUser.user.avatarURL({dynamic: true}))
                            .setDescription(`${tempString}.`)
                            .setTimestamp()
                            .setFooter(`Requested by ${message.author.username} | ${config["bot_setup"].copyright}`, message.author.avatarURL());
                        msg.edit(embed)
                    }
                    reaction.users.remove(message.author);
                });
                msg.delete({timeout: 90000})
            }).catch(console.error);
        }, 800);
        // 1 = return
        // 2 = add
        // 3 = minus
        function UseSlideNumber(set) {
            if(set == 1) {
                return slide;
            }
            if(set == 2) {
                slide++;
                if(slide > 2) {
                    slide = 2
                }
            }
            if(set == 3) {
                slide--;
                if(slide <= 0) {
                    slide = 1
                }
            }
        }
    }, 300);
};

module.exports.help = {
    name: "userinfo",
    name2: "ui",
    category: 4,
    perm: config["command_perms"].userinfo_needed_perm,
    description: "Get a users profile and guild information.",

}