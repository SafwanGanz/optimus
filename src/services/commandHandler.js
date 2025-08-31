const pluginManager = require('./pluginManager');
const config = require('../config/config');

module.exports = {
  handle: async (sock, message, text) => {
    if (!text.startsWith(config.prefix)) return;
    const args = text.slice(config.prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    const plugin = pluginManager.getPlugin(command);
    if (!plugin) return;
    await plugin.execute(sock, message, args);
  }
};