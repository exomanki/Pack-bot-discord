// Created by -MeTi-
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");
var createHTML = require('create-html');

var applicationConfig = {
    enabled: true,
    application_channels: [""],
    question_one: "",
    question_two: "",
    question_three: "",
    question_four: "",
    question_five: "",
    question_six: "",
    question_seven: "",
    question_eight: "",
    question_nine: "",
    question_ten: "",
    question_eleven: "",
    question_tweve: "",
    question_thirteen: "",
    question_fourteen: "",
    question_fifteen: "",
    question_sixteen: "",
    question_seventeen: "",
    question_eighteen: "",
    question_nineteen: "",
    question_twenty: "",
}

module.exports.run = async (bot, message, args, connection) => {
    if(applicationConfig.enabled) {
        
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

        message.guild.channels.create(`app-${message.author.username}`, {
            type: 'text', 
            permissionOverwrites: permissionOverwriteArray
        }).then(channy => {
            message.channel.send(`${message.author}, your application has been created - <#${channy.id}>`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
            let answersArray = [];
            // AUTO
            if(applicationConfig.question_one != "") {
                const filter = m => m.author.id === message.author.id;
                channy.send(`**${applicationConfig.question_one}**`).then(daMessage => {
                    channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                        answersArray.push({id: 1, q: applicationConfig.question_one, a: ans.first().content});
                        let msg3 = await channy.messages.fetch(ans.first().id)
                        daMessage.delete();
                        msg3.delete();
                    }).then(msg2 => {
                        if(applicationConfig.question_two != "") {
                            channy.send(`**${applicationConfig.question_two}**`).then(daMessage => {
                                channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                    answersArray.push({id: 2, q: applicationConfig.question_two, a: ans.first().content});
                                    let msg3 = await channy.messages.fetch(ans.first().id)
                                    daMessage.delete();
                                    msg3.delete();
                                }).then(msg2 => {
                                    if(applicationConfig.question_three != "") {
                                        channy.send(`**${applicationConfig.question_three}**`).then(daMessage => {
                                            channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                answersArray.push({id: 3, q: applicationConfig.question_three, a: ans.first().content});
                                                let msg3 = await channy.messages.fetch(ans.first().id)
                                                daMessage.delete();
                                                msg3.delete();
                                            }).then(msg2 => {
                                                if(applicationConfig.question_four != "") {
                                                    channy.send(`**${applicationConfig.question_four}**`).then(daMessage => {
                                                        channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                            answersArray.push({id: 4, q: applicationConfig.question_four, a: ans.first().content});
                                                            let msg3 = await channy.messages.fetch(ans.first().id)
                                                            daMessage.delete();
                                                            msg3.delete();
                                                        }).then(msg2 => {
                                                            if(applicationConfig.question_five != "") {
                                                                channy.send(`**${applicationConfig.question_five}**`).then(daMessage => {
                                                                    channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                        answersArray.push({id: 5, q: applicationConfig.question_five, a: ans.first().content});
                                                                        let msg3 = await channy.messages.fetch(ans.first().id)
                                                                        daMessage.delete();
                                                                        msg3.delete();
                                                                    }).then(msg2 => {
                                                                        if(applicationConfig.question_six != "") {
                                                                            channy.send(`**${applicationConfig.question_six}**`).then(daMessage => {
                                                                                channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                    answersArray.push({id: 6, q: applicationConfig.question_six, a: ans.first().content});
                                                                                    let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                    daMessage.delete();
                                                                                    msg3.delete();
                                                                                }).then(msg2 => {
                                                                                    if(applicationConfig.question_seven != "") {
                                                                                        channy.send(`**${applicationConfig.question_seven}**`).then(daMessage => {
                                                                                            channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                answersArray.push({id: 7, q: applicationConfig.question_seven, a: ans.first().content});
                                                                                                let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                daMessage.delete();
                                                                                                msg3.delete();
                                                                                            }).then(msg2 => {
                                                                                                if(applicationConfig.question_eight != "") {
                                                                                                    channy.send(`**${applicationConfig.question_eight}**`).then(daMessage => {
                                                                                                        channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                            answersArray.push({id: 8, q: applicationConfig.question_eight, a: ans.first().content});
                                                                                                            let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                            daMessage.delete();
                                                                                                            msg3.delete();
                                                                                                        }).then(msg2 => {
                                                                                                            if(applicationConfig.question_nine != "") {
                                                                                                                channy.send(`**${applicationConfig.question_nine}**`).then(daMessage => {
                                                                                                                    channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                        answersArray.push({id: 9, q: applicationConfig.question_nine, a: ans.first().content});
                                                                                                                        let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                        daMessage.delete();
                                                                                                                        msg3.delete();
                                                                                                                    }).then(msg2 => {
                                                                                                                        if(applicationConfig.question_ten != "") {
                                                                                                                            channy.send(`**${applicationConfig.question_ten}**`).then(daMessage => {
                                                                                                                                channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                    answersArray.push({id: 10, q: applicationConfig.question_ten, a: ans.first().content});
                                                                                                                                    let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                    daMessage.delete();
                                                                                                                                    msg3.delete();
                                                                                                                                }).then(msg2 => {
                                                                                                                                    if(applicationConfig.question_eleven != "") {
                                                                                                                                        channy.send(`**${applicationConfig.question_eleven}**`).then(daMessage => {
                                                                                                                                            channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                answersArray.push({id: 11, q: applicationConfig.question_eleven, a: ans.first().content});
                                                                                                                                                let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                daMessage.delete();
                                                                                                                                                msg3.delete();
                                                                                                                                            }).then(msg2 => {
                                                                                                                                                if(applicationConfig.question_tweve != "") {
                                                                                                                                                    channy.send(`**${applicationConfig.question_tweve}**`).then(daMessage => {
                                                                                                                                                        channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                            answersArray.push({id: 12, q: applicationConfig.question_tweve, a: ans.first().content});
                                                                                                                                                            let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                            daMessage.delete();
                                                                                                                                                            msg3.delete();
                                                                                                                                                        }).then(msg2 => {
                                                                                                                                                            if(applicationConfig.question_thirteen != "") {
                                                                                                                                                                channy.send(`**${applicationConfig.question_thirteen}**`).then(daMessage => {
                                                                                                                                                                    channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                        answersArray.push({id: 13, q: applicationConfig.question_thirteen, a: ans.first().content});
                                                                                                                                                                        let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                        daMessage.delete();
                                                                                                                                                                        msg3.delete();
                                                                                                                                                                    }).then(msg2 => {
                                                                                                                                                                        if(applicationConfig.question_fourteen != "") {
                                                                                                                                                                            channy.send(`**${applicationConfig.question_fourteen}**`).then(daMessage => {
                                                                                                                                                                                channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                    answersArray.push({id: 14, q: applicationConfig.question_fourteen, a: ans.first().content});
                                                                                                                                                                                    let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                                    daMessage.delete();
                                                                                                                                                                                    msg3.delete();
                                                                                                                                                                                }).then(msg2 => {
                                                                                                                                                                                    if(applicationConfig.question_fifteen != "") {
                                                                                                                                                                                        channy.send(`**${applicationConfig.question_fifteen}**`).then(daMessage => {
                                                                                                                                                                                            channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                                answersArray.push({id: 15, q: applicationConfig.question_fifteen, a: ans.first().content});
                                                                                                                                                                                                let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                                                daMessage.delete();
                                                                                                                                                                                                msg3.delete();
                                                                                                                                                                                            }).then(msg2 => {
                                                                                                                                                                                                if(applicationConfig.question_sixteen != "") {
                                                                                                                                                                                                    channy.send(`**${applicationConfig.question_sixteen}**`).then(daMessage => {
                                                                                                                                                                                                        channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                                            answersArray.push({id: 16, q: applicationConfig.question_sixteen, a: ans.first().content});
                                                                                                                                                                                                            let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                                                            daMessage.delete();
                                                                                                                                                                                                            msg3.delete();
                                                                                                                                                                                                        }).then(msg2 => {
                                                                                                                                                                                                            if(applicationConfig.question_seventeen != "") {
                                                                                                                                                                                                                channy.send(`**${applicationConfig.question_seventeen}**`).then(daMessage => {
                                                                                                                                                                                                                    channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                                                        answersArray.push({id: 17, q: applicationConfig.question_seventeen, a: ans.first().content});
                                                                                                                                                                                                                        let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                                                                        daMessage.delete();
                                                                                                                                                                                                                        msg3.delete();
                                                                                                                                                                                                                    }).then(msg2 => {
                                                                                                                                                                                                                        if(applicationConfig.question_eighteen != "") {
                                                                                                                                                                                                                            channy.send(`**${applicationConfig.question_eighteen}**`).then(daMessage => {
                                                                                                                                                                                                                                channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                                                                    answersArray.push({id: 18, q: applicationConfig.question_eighteen, a: ans.first().content});
                                                                                                                                                                                                                                    let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                                                                                    daMessage.delete();
                                                                                                                                                                                                                                    msg3.delete();
                                                                                                                                                                                                                                }).then(msg2 => {
                                                                                                                                                                                                                                    if(applicationConfig.question_nineteen != "") {
                                                                                                                                                                                                                                        channy.send(`**${applicationConfig.question_nineteen}**`).then(daMessage => {
                                                                                                                                                                                                                                            channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                                                                                answersArray.push({id: 19, q: applicationConfig.question_nineteen, a: ans.first().content});
                                                                                                                                                                                                                                                let msg3 = await channy.messages.fetch(ans.first().id)
                                                                                                                                                                                                                                                daMessage.delete();
                                                                                                                                                                                                                                                msg3.delete();
                                                                                                                                                                                                                                            }).then(msg2 => {
                                                                                                                                                                                                                                                if(applicationConfig.question_twenty != "") {
                                                                                                                                                                                                                                                    channy.send(`**${applicationConfig.question_twenty}**`).then(daMessage => {
                                                                                                                                                                                                                                                        channy.awaitMessages(filter, {max: 1, time: ms('1h'), errors: ['time']}).then(async (ans) => {
                                                                                                                                                                                                                                                            answersArray.push({id: 20, q: applicationConfig.question_twenty, a: ans.first().content});
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
                                                                                                                                                                                                                    }).catch(console.error);
                                                                                                                                                                                                                }).catch(console.error);
                                                                                                                                                                                                            } else {sendTheAnswers()}
                                                                                                                                                                                                        }).catch(console.error);
                                                                                                                                                                                                    }).catch(console.error);
                                                                                                                                                                                                } else {sendTheAnswers()}
                                                                                                                                                                                            }).catch(console.error);
                                                                                                                                                                                        }).catch(console.error);
                                                                                                                                                                                    } else {sendTheAnswers()}
                                                                                                                                                                                }).catch(console.error);
                                                                                                                                                                            }).catch(console.error);
                                                                                                                                                                        } else {sendTheAnswers()}
                                                                                                                                                                    }).catch(console.error);
                                                                                                                                                                }).catch(console.error);
                                                                                                                                                            } else {sendTheAnswers()}
                                                                                                                                                        }).catch(console.error);
                                                                                                                                                    }).catch(console.error);
                                                                                                                                                } else {sendTheAnswers()}
                                                                                                                                            }).catch(console.error);
                                                                                                                                        }).catch(console.error);
                                                                                                                                    } else {sendTheAnswers()}
                                                                                                                                }).catch(console.error);
                                                                                                                            }).catch(console.error);
                                                                                                                        } else {sendTheAnswers()}
                                                                                                                    }).catch(console.error);
                                                                                                                }).catch(console.error);
                                                                                                            } else {sendTheAnswers()}
                                                                                                        }).catch(console.error);
                                                                                                    }).catch(console.error);
                                                                                                } else {sendTheAnswers()}
                                                                                            }).catch(console.error);
                                                                                        }).catch(console.error);
                                                                                    } else {sendTheAnswers()}
                                                                                }).catch(console.error);
                                                                            }).catch(console.error);
                                                                        } else {sendTheAnswers()}
                                                                    }).catch(console.error);
                                                                }).catch(console.error);
                                                            } else {sendTheAnswers()}
                                                        }).catch(console.error);
                                                    }).catch(console.error);
                                                } else {sendTheAnswers()}
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
                let applicationsJson = JSON.parse(fs.readFileSync('./db/applications.json', "utf8"));
                appId = message.id.charAt(0)+message.id.substr(message.id.length - 4);
                channy.send(`Your application has been sent! You also have been given a copy for your records.`).catch(console.error)

                htBody = `<div id="wrapper"><div id="main"><div class="inner"><h1 id="text01">Application - ${message.author.username}</h1><p id="text03"><span><strong>Application ID:</strong> <code>#${appId}</code></span><br /><br /><span><strong><span style="color: #f1c40d">User Details:</span></strong></span><br /><span><span style="color: #3398DB">User Tag</span>: ${message.author.tag}</span><br /><span><span style="color: #3398DB">User ID</span>: ${message.author.id}</span><br /><span><span style="color: #3398DB">Date Submitted</span>: ${message.createdAt.toLocaleString()}</span></p><hr id="divider02">`
                for(const item in answersArray) {
                    htBody += `<h2 id="text04">${answersArray[item].q}</h2><p id="text02">${answersArray[item].a}</p><hr id="divider01">`
                }

                setTimeout(async () => {
                    htBody += `<p id="text03">Application system created by <a href="https://faxes.zone">FAXES</a></p></div></div></div>`
                    var html = createHTML({
                        title: `Application - ${message.author.username}`,
                        scriptAsync: true,
                        css: 'https://faxes.zone/u/k7ybk.css',
                        lang: 'en',
                        head: `<meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /><meta name="og:image" content="${message.author.avatarURL({dynamic: true})}" /><meta name="description" content="Application from ${message.author.username} at ${message.createdAt.toLocaleString()}" /><meta property="og:title" content="Application - ${message.author.username}" /><meta property="og:type" content="website" /><meta property="og:description" content="Application from ${message.author.username} at ${message.createdAt.toLocaleString()}" /><link href="https://fonts.googleapis.com/css?family=Arimo:700,700italic,900,900italic%7CAsap:400,400italic,700,700italic" rel="stylesheet" type="text/css" />`,
                        body: htBody,
                    });
                    fs.writeFile(`./db/Application_${message.author.username}.html`, html, function (err) {
                        if (err && config["bot_setup"].debug_mode) console.log(err)
                    });
                    setTimeout(async () => {
                        applicationConfig.application_channels.forEach(channelId => {
                            let channel = bot.channels.cache.get(channelId);
                            if(!channel) {
                                console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'application/application_channels'. Please check your configured channel ID's.`)
                            } else {
                                channel.send(`\`#${appId}\` Application from ${message.author} (${message.author.tag}):`, {
                                    files: [`${__dirname.replace('\extensions', '')}/db/Application_${message.author.username}.html`]
                                });
                            }
                        });
                        message.author.send(`\`#${appId}\` Here is a copy of your application...`, {
                            files: [`${__dirname.replace('\extensions', '')}/db/Application_${message.author.username}.html`]
                        });
                        applicationsJson[appId] = {
                            id: appId,
                            userId: message.author.id,
                            reason: ""
                        };
                        fs.writeFile("./db/applications.json", JSON.stringify(applicationsJson, null, 4), (err) => {
                            if(err && config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mError updating applications.json file. See below error for details\n${err}`);
                        });
                    }, 3000);
                }, 2000);
                setTimeout(async () => {
                    fs.unlinkSync(`./db/Application_${message.author.username}.html`)
                    channy.delete()
                }, 20000);
            }
        });
    }
};

module.exports.help = {
    name: "app",
    name2: "apply",
    category: 1,
    perm: 4,
    description: "Create an application.",

}