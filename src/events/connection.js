const { Boom } = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');
const qrcode = require('qrcode');

module.exports = (sock, saveCreds) => {
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      const qrCode = await qrcode.toString(qr, { type: 'terminal', small: true });
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🤖 OPTIMUS-VOID | SCAN QR CODE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log(qrCode);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      if (statusCode === DisconnectReason.loggedOut) {
        logger.error('❌ Connection closed: Logged out from WhatsApp');
      } else if (statusCode === DisconnectReason.connectionClosed) {
        logger.error('❌ Connection closed: Connection closed by server');
      } else if (statusCode === DisconnectReason.connectionLost) {
        logger.error('❌ Connection closed: Connection lost');
      } else if (statusCode === DisconnectReason.connectionReplaced) {
        logger.error('❌ Connection closed: Connection replaced on another device');
      } else if (lastDisconnect?.error) {
        logger.error(`❌ Connection error: ${lastDisconnect.error.message}`);
      } else {
        logger.error('❌ Connection closed for unknown reason');
      }
      
      if (shouldReconnect) {
        logger.info('🔄 Reconnecting to WhatsApp...');
    
        setTimeout(() => {
          logger.info('Restarting Optimus-Void...');
          process.exit(0);
        }, 3000);
      }
    } else if (connection === 'open') {
      logger.info('✅ OPTIMUS-VOID: Connected to WhatsApp');
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
};
