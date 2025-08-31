const makeWASocket = require('@whiskeysockets/baileys').default;
const { Browsers } = require('@whiskeysockets/baileys');
const store = require('../utils/store');
const logger = require('../utils/logger');

module.exports = (authState) => {
  return makeWASocket({
    auth: authState,
    logger,
    browser: Browsers.ubuntu('Optimus-Void'),
    printQRInTerminal: true,
    cachedGroupMetadata: async (jid) => await store.getGroupMetadata(jid),
    getMessage: async (key) => await store.getMessage(key)
  });
};