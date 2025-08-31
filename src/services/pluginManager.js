const plugins = require('../plugins');

module.exports = {
  getPlugins: () => plugins,
  getPlugin: (command) => plugins.find(p => p.command === command)
};