const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const logger = require('./logger');

module.exports = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_optimus_void');
  return { state, saveCreds };
};