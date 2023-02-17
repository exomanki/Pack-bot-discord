// Created by -MeTi-#1111
console.log("\x1b[93mLoading FiveM Store Bot...\x1b[0m");const config = require('./config.json');
const fs = require("fs");const ms = require("ms");const mysql = require('mysql');
const Discord = require('discord.js');const bot = new Discord.Client();
const express = require("express");
bot.commands = new Discord.Collection();
var connection;
const app = express()
app.listen(8080)
app.get("/", function(req, res) {
	res.sendFile("db/status.html", {root: __dirname})
});

if(config["db_setup"].usedb) {
	connection = mysql.createConnection({
		host     : config["db_setup"].dbhost,
		user     : config["db_setup"].dbuser,
		password : config["db_setup"].dbpassword,
		database : config["db_setup"].dbname,
	});
	
	setInterval(function () {
		if(config["bot_setup"].debug_mode) {
			console.log(`\x1b[93m[Debug] \x1b[0mPinging SQL server to insure it hasn't timed out.`)
		}
		connection.ping();
	}, ms("25m"));
}

fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if(file.endsWith('.js')) {
			let event = require(`./events/${file}`);
			event.run(bot, connection);
			if(config["bot_setup"].debug_mode) {
				console.log(`\x1b[93m[Debug] \x1b[0m/events/${file} \x1b[32mloaded\x1b[0m.`)
			}
		}
	});
});

fs.readdir('./commands/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if(file.endsWith('.js')) {
			let comm = require(`./commands/${file}`);
			bot.commands.set(comm.help.name, comm);
			if (comm.help.name2 != null) bot.commands.set(comm.help.name2, comm);
			if(config["bot_setup"].debug_mode) {
				console.log(`\x1b[93m[Debug] \x1b[0m/commands/${file} \x1b[32mloaded\x1b[0m.`)
			}
		}
	}); 
});

var glob = require("glob")
glob('./extensions/**/*.js', function (err, files) {
	if (err) return console.error(err);
	files.forEach(file => {
		if(file.endsWith('.js')) {
			if(file.search("cmd_") >= 0 ) {
				let comm = require(file);
				bot.commands.set(comm.help.name, comm);
				if (comm.help.name2 != null) bot.commands.set(comm.help.name2, comm);
				if(config["bot_setup"].debug_mode) {
					console.log(`\x1b[93m[Debug] \x1b[0m${file} \x1b[32mloaded\x1b[0m.`)
				}
			} else {
				let event = require(file);
				event.run(bot, connection);
				if(config["bot_setup"].debug_mode) {
					console.log(`\x1b[93m[Debug] \x1b[0m${file} \x1b[32mloaded\x1b[0m.`)
				}
			}
		}
	});
});



bot.on('error', console.error);
bot.on('ready', () => {
	console.log(`Created by \x1b[36m -MeTi-#1111 - www.fivem-store.com \x1b[0m`)
	console.log(`\x1b[32mFiveM Store Bot has loaded & Online. If you experience errors try turn debug mode on. \x1b[0m`);

	bot.user.setPresence({ activity: { name: config["bot_setup"].bot_game, type: config["bot_setup"].bot_game_type }, status: config["bot_setup"].bot_status }).catch(console.error);
});

if(config["bot_setup"].debug_mode && config["db_setup"].usedb) {
	connection.connect(err => {
		if(err) throw err;
		console.log(`\x1b[93m[Debug] \x1b[0mConnected to database\x1b[0m`)
	});
}

function doesUserHavePerms(message, lvl) {
	let ownerPermArray = config["admin_management"].owner_roles;
	let adminPermArray = config["admin_management"].admin_roles;
	let staffPermArray = config["admin_management"].staff_roles;
	if(lvl == 1) {
		if(message.member.roles.cache.some(r=>ownerPermArray.includes(r.id))) return true;
	} else if (lvl == 2) {
		if(message.member.roles.cache.some(r=>ownerPermArray.includes(r.id))) return true;
		if(message.member.roles.cache.some(r=>adminPermArray.includes(r.id))) return true;
	} else if (lvl == 3) {
		if(message.member.roles.cache.some(r=>ownerPermArray.includes(r.id))) return true;
		if(message.member.roles.cache.some(r=>adminPermArray.includes(r.id))) return true;
		if(message.member.roles.cache.some(r=>staffPermArray.includes(r.id))) return true;
	} else if (lvl == 4) {
		return true;
	}
	return false;
}

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
	let prefixPresent = false;
    let prefixes = config["bot_setup"].prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);
	for(const aPrefix of prefixes) {
		if(message.content.startsWith(aPrefix)) prefixPresent = aPrefix;
	}
	if(!prefixPresent) return;
	let commandfile = bot.commands.get(cmd.slice(prefixPresent.length));
	message.delete({timeout: 500});
	if(!commandfile) return
	if(config["admin_management"].use_custom_perms && doesUserHavePerms(message, commandfile.help.perm) == false) return message.channel.send(`:x: Insufficient permissions to use this command (\`${cmd}\`).`).then(msg => msg.delete({timeout: 5000})).catch(console.error);
	commandfile.run(bot, message, args, connection);	
	if(config["bot_setup"].debug_mode) console.log(`\x1b[93m[Debug] \x1b[0mCommand ran by ${message.author.tag} \x1b[37m(${cmd+' '+args})\x1b[0m`)
	if(config["logging_module"].enable_command_logging) {
		const embed = new Discord.MessageEmbed()
			.setColor(config["bot_setup"].feature_color)
			.setDescription(`**${message.author} (${message.author.tag})** used command: \n\`\`\`css\n${cmd} ${args}\`\`\``.split(',').join(' '))
    		.setFooter(`Used in #${message.channel.name}`)
			.setTimestamp()
			.setFooter(config["bot_setup"].copyright);
		
		config["logging_module"].command_logging_channels.forEach(channelId => {
			let channel = bot.channels.cache.get(channelId);
			if(!channel) {
				console.log(`\x1b[91m[ALERT] \x1b[0mChannel (${channelId}) not found for 'command_logging_channels'. Please check your configured channel ID's.`)
			} else {
				channel.send(embed).catch();
			}
		});
	}
});

bot.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = bot.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.cache.get(emoji);
		// Adds the currently reacting user to the reaction's users collection.
		// AUTO
        if (reaction) reaction.users.cache.set(packet.d.user_id, bot.users.cache.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, bot.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            bot.emit('messageReactionRemove', reaction, bot.users.cache.get(packet.d.user_id));
        }
    });
});

// Debug and login.
if(config["bot_setup"].debug_mode) {
    bot.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });
}
bot.login(config["bot_setup"].token);