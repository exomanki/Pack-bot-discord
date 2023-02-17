// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args, connection) => {
    let index = 0;
    let someCoolArrayThatsGonnaGo = [];
    let top15String = "";
    let chatLvlJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));

    if(config["leveling_module"].enabled) {
        if(config["db_setup"].usedb) {
            connection.query("SELECT * FROM chatlvl ORDER BY xp DESC LIMIT 15", (err, results) => {
                results.forEach(eboy => {
                    let ItsTheendOfTheWorldAsWeKnowIt = message.guild.members.cache.find(allPeopleLol => allPeopleLol.id == eboy.id);
                    if(ItsTheendOfTheWorldAsWeKnowIt){
                        someCoolArrayThatsGonnaGo.push({chatInfo: eboy, username: ItsTheendOfTheWorldAsWeKnowIt.user.tag});
                    } else {
                        someCoolArrayThatsGonnaGo.push({chatInfo: eboy, username: "Unknown User (Left)"});
                    }
                });

                someCoolArrayThatsGonnaGo.forEach(PlaceElementHereHahaIts3am => {
                    index++;
                    if(index < 10) index = `0${index}`;
                    if (index == 1) {
                        top15String += `\`${index}.\` :first_place: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                    } else if (index == 2) {
                        top15String += `\`${index}.\` :second_place: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                    } else if (index == 3) {
                        top15String += `\`${index}.\` :third_place: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                    } else if ( index <= 15 ) {
                        top15String += `\`${index}.\` :checkered_flag: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                    }
                })
                const embed = new Discord.MessageEmbed()
                .setTitle(`__${message.guild.name}__ Chat Leaderboard`)
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setColor(config["bot_setup"].feature_color)
                .setDescription(top15String)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ${config["bot_setup"].copyright}`, message.author.avatarURL());
            message.channel.send(embed).then(msg => msg.delete({timeout: 60000})).catch(console.error);
            });
        } else {
            const daKeysYeet = Object.keys(chatLvlJson);

            daKeysYeet.forEach(eboy => {
                let ItsTheendOfTheWorldAsWeKnowIt = message.guild.members.cache.find(allPeopleLol => allPeopleLol.id == eboy);
                if(ItsTheendOfTheWorldAsWeKnowIt){
                    someCoolArrayThatsGonnaGo.push({chatInfo: chatLvlJson[eboy], username: ItsTheendOfTheWorldAsWeKnowIt.user.tag});
                } else {
                    someCoolArrayThatsGonnaGo.push({chatInfo: chatLvlJson[eboy], username: "Unknown User (Left)"});
                }
            });

            someCoolArrayThatsGonnaGo.sort((aToThe, bToDaZ) => bToDaZ.chatInfo.xp - aToThe.chatInfo.xp);
            someCoolArrayThatsGonnaGo.forEach(PlaceElementHereHahaIts3am => {
                index++;
                if(index < 10) index = `0${index}`;
                if (index == 1) {
                    // AUTO
                    top15String += `\`${index}.\` :first_place: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                } else if (index == 2) {
                    top15String += `\`${index}.\` :second_place: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                } else if (index == 3) {
                    top15String += `\`${index}.\` :third_place: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                } else if ( index <= 15 ) {
                    top15String += `\`${index}.\` :checkered_flag: **Lvl:** ${PlaceElementHereHahaIts3am.chatInfo.lvl} **XP:** ${PlaceElementHereHahaIts3am.chatInfo.xp} - ${PlaceElementHereHahaIts3am.username}\n`
                }
            })
            const embed = new Discord.MessageEmbed()
                .setTitle(`__${message.guild.name}__ Chat Leaderboard`)
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setColor(config["bot_setup"].feature_color)
                .setDescription(top15String)
                .setTimestamp()
                .setFooter(`Requested by ${message.author.username} | ${config["bot_setup"].copyright}`, message.author.avatarURL());
            message.channel.send(embed).then(msg => msg.delete({timeout: 60000})).catch(console.error);
        }
    }
};

module.exports.help = {
    name: "leaderboard",
    name2: "lb",
    category: 2,
    perm: config["command_perms"].leaderboard_needed_perm,
    description: "The leaderboard with top chat level users.",
}