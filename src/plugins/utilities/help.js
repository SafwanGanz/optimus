const config = require('../../config/config');
const path = require('path');
const fs = require('fs');

function loadAllPlugins() {
  const pluginDirs = ['admin', 'group', 'moderation', 'utilities'];
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
    let helpText = 'Available Commands\n\n';
    const allPlugins = loadAllPlugins();
    console.log('[DEBUG] allPlugins in help execute:', allPlugins);
    if (allPlugins.length === 0) {
      helpText += 'No commands found. Please check for errors in your plugin files.';
    } else {
      for (const plugin of allPlugins) {
        helpText += `${config.prefix}${plugin.command}: ${plugin.description}\nUsage: ${plugin.usage}\n\n`;
      }
    }
    return sock.sendMessage(message.key.remoteJid, { text: helpText }, { quoted: message });
  }
};