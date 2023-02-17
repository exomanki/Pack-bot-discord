// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
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

module.exports.run = async (bot, message, args, connection) => {
    let daUserElement,daUserElementId,daUserElementUser,daUserElementAvatar;
    let mentionedUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!mentionedUser) {
        daUserElement = message.author;
        daUserElementId = message.author.id;
        daUserElementUser = message.author.username;
        daUserElementAvatar = message.author.avatarURL({format: 'png', dynamic: true});
    } else {
        daUserElement = mentionedUser;
        daUserElementId = mentionedUser.id;
        daUserElementUser = mentionedUser.user.username;
        daUserElementAvatar = mentionedUser.user.avatarURL({format: 'png', dynamic: true});
    }
    // async function getChatLevel(userId) {
    //     let chatJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));
    //     let array = {lvl: 0, xp: 0}
    //     if(config["db_setup"].usedb) {
    //         connection.query(`SELECT * FROM chatlvl where id = '${userId}'`, async (err, results)  => {
    //             if(results[0]) {
    //                 array = {lvl: results[0].lvl, xp: results[0].xp}
    //             }
    //         });
    //     } else {
    //         if(chatJson[userId]) {
    //             array = {lvl: chatJson[userId].lvl, xp: chatJson[userId].xp}
    //         }
            
    //     }
    //     setTimeout(() => {
    //         console.log(returnArray)
    //         return returnArray;
    //     }, 800)
    // }

    function getRankDisplay(usersLvl) {
        if(usersLvl >= 500) return config["leveling_module"].above_500_rank_name;
        if(usersLvl >= 300) return config["leveling_module"].above_300_rank_name;
        if(usersLvl >= 250) return config["leveling_module"].above_250_rank_name;
        if(usersLvl >= 200) return config["leveling_module"].above_200_rank_name;
        if(usersLvl >= 150) return config["leveling_module"].above_150_rank_name;
        if(usersLvl >= 100) return config["leveling_module"].above_100_rank_name;
        if(usersLvl >= 75) return config["leveling_module"].above_75_rank_name;
        if(usersLvl >= 50) return config["leveling_module"].above_50_rank_name;
        if(usersLvl >= 25) return config["leveling_module"].above_25_rank_name;
        if(usersLvl >= 10) return config["leveling_module"].above_10_rank_name;
        if(usersLvl < 10) return config["leveling_module"].below_10_rank_name;
    }

    

    let chatJson = await JSON.parse(fs.readFileSync('./db/chatlvl.json', "utf8"));
    let array = {lvl: 0, xp: 0}
    if(config["db_setup"].usedb) {
        connection.query(`SELECT * FROM chatlvl where id = '${daUserElementId}'`, async (err, results)  => {
            if(results[0]) {
                array = {lvl: results[0].lvl, xp: results[0].xp}
            }
        });
    } else {
        if(chatJson[daUserElementId]) {
            array = {lvl: chatJson[daUserElementId].lvl, xp: chatJson[daUserElementId].xp}
        }
        
    }
    setTimeout(async function(){
        const rankDis = getRankDisplay(array.lvl);
        if(config["leveling_module"].enable_rank_command) {
            if(config["leveling_module"].enable_rank_command_image) {
                const canvas = Canvas.createCanvas(700, 250);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage('./db/rankimg.png');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = 'rgba(0,0,0,0.0)';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                // Slightly smaller text placed above the member's display name
                ctx.font = '24px ChronicaPro-Black';
                ctx.fillStyle = '#eeeeee';
                ctx.fillText(`${daUserElementUser} - Lvl ${array.lvl} has,`, canvas.width / 2.5, canvas.height / 2.5);
                ctx.font = '20px ChronicaPro-Black';
                ctx.fillText(`Rank: ${rankDis}.`, canvas.width / 2.5, canvas.height / 1.3);

                // Add an exclamation point here and below
                ctx.font = applyText(canvas, `${message.author.username}!`);
                ctx.fillStyle = '#eeeeee';
                ctx.fillText(`${array.xp} XP`, canvas.width / 2.5, canvas.height / 1.6);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(daUserElementAvatar);
                
                ctx.drawImage(avatar, 25, 25, 200, 200);
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'xp.gif');
                // message.channel.send(`${daUserElement}'s XP `, attachment).then(msg => msg.delete(ms("40s")));
                message.channel.send({
                    files: [attachment]
                }).then(msg => msg.delete({timeout: 40000}));
            } else {
                message.channel.send(`${daUserElement} with rank __${rankDis}__ has \`${array.xp} XP\` and is chat level ${array.lvl}.`).then(msg => msg.delete({timeout: 40000}));
            }
        }
    }, 800);
    
};

module.exports.help = {
    name: "xp",
    name2: "rank",
    category: 2,
    perm: config["command_perms"].rank_needed_perm,
    description: "Get yours or another users rank and chat level.",

}