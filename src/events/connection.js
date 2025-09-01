const { Boom } = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');
const qrcode = require('qrcode');

module.exports = (sock, saveCreds) => {
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      const qrCode = await qrcode.toString(qr, { type: 'terminal', small: true });
      console.log('Optimus-Void: Scan this QR code to authenticate:\n', qrCode);
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.info('Connection closed:', lastDisconnect.error, 'Reconnecting:', shouldReconnect);
      if (shouldReconnect) require('../../index')();
    } else if (connection === 'open') {
      logger.info('Optimus-Void: Connection opened');
    }
  });
  sock.ev.on('creds.update', saveCreds);
};
