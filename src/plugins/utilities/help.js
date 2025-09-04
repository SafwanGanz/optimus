const config = require('../../config/config');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const media = require('../media');

require('dotenv').config();

function loadAllPlugins() {
  const pluginDirs = ['admin', 'group', 'moderation', 'utilities', 'media'];
  const pluginRoot = path.join(__dirname, '..');
  let all = [];
  for (const dir of pluginDirs) {
    const dirPath = path.join(pluginRoot, dir);
    try {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        if (file.endsWith('.js') && file !== 'index.js' && file !== 'help.js') {
          const pluginPath = path.join(dirPath, file);
          try {
            const plugin = require(pluginPath);
            if (plugin && plugin.command && plugin.description && plugin.usage) {
              all.push(plugin);
            }
          } catch (e) {
            console.error(`[PLUGIN ERROR] ${dir}/${file}:`, e.message);
          }
        }
      }
    } catch (e) {
      console.error(`[DIR ERROR] ${dir}:`, e.message);
    }
  }
  return all;
}

module.exports = {
  command: 'help',
  description: 'List all available commands',
  usage: `${config.prefix}help`,
  execute: async (sock, message) => {
    let helpText = '✨ *Optimus Void Help Menu* ✨\n';
    helpText += 'Here are all available commands:\n\n';
    const allPlugins = loadAllPlugins();
    if (allPlugins.length === 0) {
      helpText += '⚠️ _No commands found. Please check for errors in your plugin files._';
    } else {
      for (const plugin of allPlugins) {
        helpText += `• *${config.prefix}${plugin.command}*  — _${plugin.description}_\n`;
      }
    }
    helpText += '━━━━━━━━━━━━━━━━━━━━━━━\n';
    helpText += `🤖 *Bot Prefix:* \`${config.prefix}\`\n`;
    helpText += 'Type a command to get started!';
    const githubUrl = 'https://github.com/SafwanGanz/optimus-void';
    const { data } = await axios('https://i.ibb.co/HpKQ6KTc/pic.jpg', {
      responseType: 'arraybuffer'
    });
    const adMessage = {
      image: {url: process.env.MENU_IMAGE_URL || 'https://i.ibb.co/HpKQ6KTc/pic.jpg'},
      caption: helpText,
      contextInfo: {
        externalAdReply: {
          title: 'Optimus Void on GitHub',
          body: 'Open Source Bot',
          mediaType: 2,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          sourceUrl: githubUrl,
          mediaUrl: githubUrl,
          thumbnail: data
      }
      }}
    return sock.sendMessage(message.key.remoteJid, adMessage, { quoted: message });
  }
};
