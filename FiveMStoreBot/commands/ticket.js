// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");

module.exports.run = async (bot, message, args, connection) => {
    if(config["ticket_module"].enabled) {
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
        config["ticket_module"].support_roles.forEach(roleId => {
            let role = message.guild.roles.cache.get(roleId);
            if(!role) {
                console.log(`\x1b[91m[ALERT] \x1b[Role (${roleId}) not found for 'support_roles'. Please check your configured channel ID's.`)
            } else {
                let tempArray = {
                    id: role.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
                }
                permissionOverwriteArray.push(tempArray)
            }
        });

        message.guild.channels.create(`ticket-${message.author.username}`, {
            type: 'text', 
            permissionOverwrites: permissionOverwriteArray
        }).then(channy => {
            var ans1 = ""
            var ans2 = ""
            var ans3 = ""
            channy.setParent(config["ticket_module"].ticket_category, {lockPermissions: false});
            message.channel.send(`${message.author}, your ticket has been created - <#${channy.id}>`).then(msg => msg.delete({timeout: 10000})).catch(console.error);

            
            
            if(config["ticket_module"].custom_question_one != "") {
                const filter = m => m.author.id === message.author.id;
                channy.send(`**${config["ticket_module"].custom_question_one}**`).then(daMessage => {
                    channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                        ans1 = ans.first().content;
                        let msg3 = await channy.messages.fetch(ans.first().id)
                        daMessage.delete();
                        msg3.delete();
                    }).then(msg2 => {
                        if(config["ticket_module"].custom_question_two != "") {
                            channy.send(`**${config["ticket_module"].custom_question_two}**`).then(daMessage => {
                                channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                    ans2 = ans.first().content;
                                    let msg3 = await channy.messages.fetch(ans.first().id)
                                    daMessage.delete();
                                    msg3.delete();
                                }).then(msg2 => {
                                    if(config["ticket_module"].custom_question_three != "") {
                                        channy.send(`**${config["ticket_module"].custom_question_three}**`).then(daMessage => {
                                            channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                ans3 = ans.first().content;
                                                let msg3 = await channy.messages.fetch(ans.first().id)
                                                daMessage.delete();
                                                msg3.delete();
                                            }).then(msg2 => {
                                                sendTheAnswers()
                                            }).catch(console.error);
                                        }).catch(console.error);
                                    } else {sendTheAnswers()}
                                }).catch(console.error);
                            }).catch(console.error);
                        } else {sendTheAnswers()}
                    }).catch(console.error);
                }).catch(console.error);
            } else {sendTheAnswers()}
            function sendTheAnswers() {
                if(config["ticket_module"].enable_archive) {
                    fs.writeFileSync(`./db/${channy.id}.json`, JSON.stringify({}, null, 4))
                    let tickFile = JSON.parse(fs.readFileSync(`./db/${channy.id}.json`, "utf8"));
                    tickFile["settings"] = {
                        creator: message.author.tag,
                        createDate: message.createdAt.toString(),
                        q1: [config["ticket_module"].custom_question_one, ans1],
                        q2: [config["ticket_module"].custom_question_two, ans2],
                        q3: [config["ticket_module"].custom_question_three, ans3]
                    };
                    fs.writeFile(`./db/${channy.id}.json`, JSON.stringify(tickFile, null, 4), (err) => {
                        if (err && config["bot_setup"].debug_mode) console.log(err)
                    });   
                }

                let embed = new Discord.MessageEmbed()
                    embed.setAuthor(`${message.author.username} Created A Ticket`, message.author.avatarURL({dynamic: true}))
                    embed.setColor(config["bot_setup"].feature_color)
                    embed.setDescription(`Thanks for creating a ticket. A support member will be with you soon.`)
                    if(config["ticket_module"].custom_question_one != "") {
                        embed.addField(config["ticket_module"].custom_question_one, ans1)
                    }
                    if(config["ticket_module"].custom_question_two != "") {
                        embed.addField(config["ticket_module"].custom_question_two, ans2)
                    }
                    if(config["ticket_module"].custom_question_three != "") {
                        embed.addField(config["ticket_module"].custom_question_three, ans3)
                    }
                    embed.setTimestamp()
                    embed.setFooter(config["bot_setup"].copyright);
                channy.send(embed).catch(console.error)
            }
        });
    }
};

module.exports.help = {
    name: "new",
    name2: "ticket",
    category: 3,
    perm: config["command_perms"].new_needed_perm,
    description: "Create a new ticket.",

}