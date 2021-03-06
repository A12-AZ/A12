const Discord = require("discord.js");

/**
 * 
 * @param {string} mutedID 
 * @param {string} guildID 
 */

const saveMutedData = async(mutedID, guildID) => {
    const db = require('./database');
    const muted_data = await db.get('muted') || {};
    if (!muted_data[guildID]) muted_data[guildID] = [];
    if (!Array.isArray(muted_data[guildID])) muted_data[guildID] = [];
    muted_data[guildID].push(mutedID);
    db.set("muted", muted_data);
}


/**
 * 
 * @param {Discord.Message} message 
 * @param {Discord.User} user 
 * @param {Discord.Guild} guild 
 * @returns 
 */

async function mute(message, user, guild) {
    const config = require('../data/config');
    const db = require('./database');
    if (!guild) guild = message.guild;
    const muterole = await db.get('mute_roles') || {};
    if (!muterole[guild.id] || !guild.roles.cache.has(muterole[guild.id])) {
        if (message) return message.channel.send("لا توجد رتبة حظر" + "\n" + "لتحديد رتبة الحظر:" + "\n" + `\`${config.prefix}mute <role>\``);
        else return;
    } else if (!user.roles) {
        if (message) return message.channel.send("لا يمكنني العثور على المستخدم المراد حظره كتابيا");
        else return;
    } else if (user.roles.cache.has(muterole[guild.id])) {
        saveMutedData(user.id, guild.id);
        if (message) return message.channel.send(`${user} حُظر كتابيا`);
        else return;
    } else {
        saveMutedData(user.id, guild.id);
        user.roles.add(muterole[guild.id]);
        if (message) message.channel.send(`تم حظر ${user} كتابيا`);
        else return;
    }
    return Promise.resolve();
};

module.exports = mute;