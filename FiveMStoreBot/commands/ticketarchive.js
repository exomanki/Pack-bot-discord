// Created by -MeTi-#1111
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");
const ms = require("ms");
var createHTML = require('create-html');

module.exports.run = async (bot, message, args, connection) => {
    if(config["ticket_module"].enabled) {
        if(!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You're not in a ticket channel.`).then(msg => msg.delete({timeout: 10000})).catch(console.error);
        if(fs.existsSync(`./db/${message.channel.id}.json`)) {
            let tickFile = await JSON.parse(fs.readFileSync(`./db/${message.channel.id}.json`, "utf8"));
            message.channel.send(`Are you sure you want to **archive** this ticket?`).then(msg => {
                msg.react('❌').then(() => msg.react('✅'));
        
                const filterE = (reaction, user) => {
                    return ['❌', '✅'].includes(reaction.emoji.name) && user.bot == false; // && user.id === message.author.id
                };
                msg.awaitReactions(filterE, { max: 1, time: ms("20m"), errors: ['time'] }).then(collected => {
                    const reaction = collected.first();
                    if(reaction.emoji.name === '❌') {
                        return message.channel.send(`Ticket archive cancelled.`)
                    }
                    if(reaction.emoji.name === '✅') {
                        message.channel.send(`This ticket has now been **archived**, A history file has been generated.`).catch(console.error);
                        htBody = `<div id="wrapper"><div id="main"><div class="inner"><h1 id="text01">Ticket Archive - ${message.channel.name}</h1><p id="text02">The below is a transcript generated.</p><p id="text05"><span><strong><span style="color: #f1c40d">Channel Details:</span></strong></span><br /><span><span style="color: #3398DB">Channel ID:</span> ${message.channel.id}</span><br /><span><span style="color: #3398DB">Creator:</span> ${tickFile["settings"].creator || "N/A"}</span><br /><span><span style="color: #3398DB">Creation Date:</span> ${tickFile["settings"].createDate || "N/A"}</span><br /><span><span style="color: #3398DB">${tickFile["settings"].q1[0]}:</span> ${tickFile["settings"].q1[1]}</span><br /><span><span style="color: #3398DB">${tickFile["settings"].q2[0]}:</span> ${tickFile["settings"].q2[1]}</span><br /><span><span style="color: #3398DB">${tickFile["settings"].q3[0]}:</span> ${tickFile["settings"].q3[1]}</span><br /><br /><span><strong><span style="color: #f1c40d">Archive Details:</span></strong></span><br /><span><span style="color: #3398DB">Archive Date/Time:</span> ${message.createdAt}</span><br /><span><span style="color: #3398DB">Archiving User:</span> ${message.author.tag}</span></p><hr id="divider02"></hr>`
                        for(const item in tickFile) {
                            if(item != "settings") {
                                htBody += `<p id="text03"><span><span style="color: #2fcc71">${tickFile[item].author}</span> <code>${tickFile[item].sentAt}</code></span><br /><span>${tickFile[item].content}</span></p>
                                <hr id="divider03">`
                            }
                        }
                        setTimeout(async () => {
                            htBody += `</div></div></div><script src="assets/main.js"></script>`
                            var html = createHTML({
                                title: `Ticket Archive - ${message.channel.name}`,
                                script: 'tools/zz4n2.js',
                                scriptAsync: true,
                                css: 'tools/3cyly.css',
                                lang: 'en',
                                head: `<meta name="description" content="Ticket Archive for ${message.channel.name}">`,
                                body: htBody,
                            })
                            fs.writeFile(`./db/Ticket_Archive-${message.channel.name}.html`, html, function (err) {
                                if (err && config["bot_setup"].debug_mode) console.log(err)
                            })
                            setTimeout(async () => {
                                config["ticket_module"].archive_file_channels.forEach(channelId => {
                                    let channel = bot.channels.cache.get(channelId);
                                    if(!channel) {
                                        console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'archive_file_channels'. Please check your configured channel ID's.`)
                                    } else {
                                        channel.send(`Ticket archive for ${message.channel.name}:`, {
                                            files: [`${__dirname.replace('\commands', '')}/db/Ticket_Archive-${message.channel.name}.html`]
                                        });
                                    }
                                });
                                message.author.send(`Ticket archive for ${message.channel.name}:`, {
                                    files: [`${__dirname.replace('\commands', '')}/db/Ticket_Archive-${message.channel.name}.html`]
                                });
                            }, 3000);
                        }, 2000);
                        setTimeout(async () => {
                            fs.unlinkSync(`./db/Ticket_Archive-${message.channel.name}.html`)
                            fs.unlinkSync(`./db/${message.channel.id}.json`)
                            message.channel.delete()
                        }, 20000);
                    }
                }).catch(() => {
                    message.channel.send('Ticket archive timed out.')
                });
            }).catch(console.error);
        }
    }
};

module.exports.help = {
    name: "archive",
    category: 3,
    perm: config["command_perms"].archive_needed_perm,
    description: "Archive a ticket and generate it into a html file.",
}