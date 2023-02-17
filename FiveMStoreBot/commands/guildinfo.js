// Created by MeTi
const Discord = require("discord.js");
const config = require("./../config.json");
const fs = require("fs");



module.exports.run = async (bot, message, args, connection) => {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function isServerPartneredOrVerified(g) {
        if(g.partnered) return 'Yes';
        if(g.verified) return 'Yes';
        return 'No';
    }
    const embed = new Discord.MessageEmbed()
        .setColor(config["bot_setup"].feature_color)
        .setTitle(`Guild Information For __${message.guild.name}__`)
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .addFields(
            {name: 'Guild ID:', value: `\`\`\`${message.guild.id}\`\`\``},

            {name: 'Owner:', value: `\`\`\`${message.guild.owner.user.username}\`\`\``, inline: true},
            {name: 'Creation Date:', value: `\`\`\`${message.guild.createdAt.toLocaleString()}\`\`\``, inline: true},
            // {name: '__Guild Settings__', value: `The guilds settings and other permissions.`},
            {name: '\u200B', value: '\u200B'},
            {name: 'Verification:', value: `\`\`\`${capitalizeFirstLetter(message.guild.verificationLevel)}\`\`\``, inline: true},
            {name: 'Content Filter:', value: `\`\`\`${capitalizeFirstLetter(message.guild.explicitContentFilter.replace(/_/g, " "))}\`\`\``, inline: true},
            {name: 'Partnerd or Verified:', value: `\`\`\`${isServerPartneredOrVerified(message.guild)}\`\`\``, inline: true},

            {name: 'Guild Region:', value: `\`${capitalizeFirstLetter(message.guild.region)}\``, inline: true},
            {name: 'Boosters:', value: `\`${message.guild.premiumSubscriptionCount}\``, inline: true},
            {name: 'Guild Boost Tier:', value: `\`${message.guild.premiumTier}\``, inline: true},

            // {name: '__Channel Settings__', value: `The guilds channel counts.`},
            {name: '\u200B', value: '\u200B'},
            {name: 'Text Channels:', value: `\`\`\`${message.guild.channels.cache.filter((c) => c.type === "text").size}\`\`\``, inline: true},
            {name: 'Voice Channels:', value: `\`\`\`${message.guild.channels.cache.filter((c) => c.type === "voice").size}\`\`\``, inline: true},
            {name: 'Categories:', value: `\`\`\`${message.guild.channels.cache.filter((c) => c.type === "category").size}\`\`\``, inline: true},

            {name: 'Roles:', value: `\`\`\`${message.guild.roles.cache.size || '0'}\`\`\``, inline: true},
            {name: 'Emojis:', value: `\`\`\`${message.guild.emojis.cache.size || '0'}\`\`\``, inline: true},

            // {name: '__User Counts__', value: `The guilds user and activity counts.`},
            {name: '\u200B', value: '\u200B'},
            {name: 'Members:', value: `\`\`\`${message.guild.members.cache.filter(member => !member.user.bot).size}\`\`\``, inline: true},
            {name: 'Bots:', value: `\`\`\`${message.guild.members.cache.filter(member => member.user.bot).size}\`\`\``, inline: true},
            {name: 'Offline:', value: `\`\`\`${message.guild.members.cache.filter(m => m.presence.status === 'offline').size}\`\`\``, inline: true},
            
            {name: 'Online:', value: `\`\`\`py\n${message.guild.members.cache.filter(m => m.presence.status === 'online').size}. \`\`\``, inline: true},
            {name: 'Idle:', value: `\`\`\`fix\n${message.guild.members.cache.filter(m => m.presence.status === 'idle').size}. \`\`\``, inline: true},
            {name: 'Do Not Disturb:', value: `\`\`\`md\n${message.guild.members.cache.filter(m => m.presence.status === 'dnd').size}. \`\`\``, inline: true},
            
        )
        .setTimestamp()
        .setFooter(`Requested by ${message.author.username} | ${config["bot_setup"].copyright}`, message.author.avatarURL());
    message.channel.send(embed).then(msg => msg.delete({timeout: 60000})).catch(console.error);
};

module.exports.help = {
    name: "sinfo",
    name2: "guildinfo",
    category: 1,
    perm: config["command_perms"].sinfo_needed_perm,
    description: "Get all the guilds information and statistics.",
}

