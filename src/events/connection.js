const { Boom } = require('@hapi/boom');
const { DisconnectReason } = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');
const qrcode = require('qrcode');
const readline = require('readline');
const { scheduleRestart } = require('../utils/restart');

module.exports = (sock, saveCreds) => {
  let connectionAttempts = 0;
  const MAX_ATTEMPTS = 3;
  let pairingAttemptActive = false;
  let qrDisplayed = false;
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      if (sock.authState?.authMethod !== 'pairing' || (sock.authState?.authMethod === 'pairing' && pairingAttemptActive === false)) {
        try {
          if (!qrDisplayed) {
            qrDisplayed = true;
            const qrCode = await qrcode.toString(qr, { type: 'terminal', small: true });
            console.clear();
            
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🤖 OPTIMUS-VOID | SCAN QR CODE');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            console.log(qrCode);
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('1. Open WhatsApp on your phone');
            console.log('2. Tap Menu or Settings and select Linked Devices');
            console.log('3. Tap on Link a Device');
            console.log('4. Point your phone camera to this QR code\n');
          
            if (sock.authState?.authMethod === 'pairing') {
              console.log('⚠️ Pairing code authentication failed, falling back to QR code method.\n');
            }
          }
        } catch (error) {
          logger.error(`Failed to generate QR code: ${error.message}`);
        }
      }
    }
    
    if (sock.authState?.authMethod === 'pairing' && !pairingAttemptActive && !connection) {
      pairingAttemptActive = true;
    }
    
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      const errorMessage = lastDisconnect?.error?.message || 'Unknown error';
      
      if (!global.isRestarting) {
        if (sock.authState?.authMethod === 'pairing' && pairingAttemptActive) {
          if (statusCode === DisconnectReason.restartRequired) {
            logger.error(`Pairing attempt failed: ${errorMessage}`);
            logger.info('🔄 Restart required for pairing - this is normal...');
            
            console.log('\n♻️ Restart required for pairing. Restarting immediately...');
            console.log('Please wait while the bot restarts automatically...');
            require('../utils/restart').createRestartFlag();
            
            process.nextTick(() => {
              process.exit(0);
            });
            return;
          }
          
          connectionAttempts++;
          
          if (connectionAttempts < MAX_ATTEMPTS) {
            logger.error(`Pairing attempt ${connectionAttempts} failed: ${errorMessage}`);
            logger.info(`Retrying pairing... (attempt ${connectionAttempts + 1}/${MAX_ATTEMPTS})`);
            
            setTimeout(() => {
              pairingAttemptActive = false;
            }, 3000);
          } else {
            logger.error(`Pairing failed after ${MAX_ATTEMPTS} attempts: ${errorMessage}`);
            console.log('\n❌ Could not connect with pairing code after multiple attempts.');
            console.log('🔄 Falling back to QR code authentication...\n');
            
            sock.authState.authMethod = 'qr';
            pairingAttemptActive = false;
          }
        } else {
          if (statusCode === DisconnectReason.loggedOut) {
            logger.error('❌ Connection closed: Logged out from WhatsApp');
          } else if (statusCode === DisconnectReason.connectionClosed) {
            logger.error('❌ Connection closed: Connection closed by server');
          } else if (statusCode === DisconnectReason.connectionLost) {
            logger.error('❌ Connection closed: Connection lost');
          } else if (statusCode === DisconnectReason.connectionReplaced) {
            logger.error('❌ Connection closed: Connection replaced on another device');
          } else if (statusCode === DisconnectReason.restartRequired) {
            logger.error('❌ Connection closed: Restart required');
            logger.info('🔄 Restart required detected - Automatically restarting...');
            
            scheduleRestart(500, 'Restart required detected');
            return;
          } else if (statusCode === DisconnectReason.timedOut) {
            logger.error('❌ Connection closed: Connection timed out');
          } else if (lastDisconnect?.error) {
            logger.error(`❌ Connection error: ${errorMessage}`);
          } else {
            logger.error('❌ Connection closed for unknown reason');
          }
          
          if (shouldReconnect && !global.isRestarting) {
            logger.info('🔄 Reconnecting to WhatsApp...');
            
            scheduleRestart(2000, 'General reconnection');
          }
        }
      } else {
        logger.info('Restart already in progress, ignoring additional restart triggers');
      }
    } else if (connection === 'open') {
      qrDisplayed = false;
      pairingAttemptActive = false;
      connectionAttempts = 0;
      
      logger.info('✅ OPTIMUS-VOID: Connected to WhatsApp');
      
      if (global.rl && typeof global.rl.close === 'function') {
        global.rl.close();
        global.rl = null;
      }
    } else if (connection === 'connecting') {
      logger.info('🔄 Connecting to WhatsApp...');
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
};
