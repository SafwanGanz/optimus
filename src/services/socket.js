const makeWASocket = require('@whiskeysockets/baileys').default;
const { Browsers, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const store = require('../utils/store');
const logger = require('../utils/logger');
const { scheduleRestart } = require('../utils/restart');
const pino = require('pino');

const baileyLogger = pino({
  level: 'warn',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'hostname,pid'
    }
  }
});

module.exports = async (authState) => {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info(`Using WA v${version.join('.')}, isLatest: ${isLatest}`);
  
  const sock = makeWASocket({
    version,
    auth: authState,
    logger: baileyLogger,
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    transactionOpts: { maxCommitRetries: 3, delayBetweenTriesMs: 100 },
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.key?.id &&
        message.key?.id?.length > 21
      );
      if (requiresPatch) {
        message.key.id = message.key?.id?.substr(0, 21);
      }
      return message;
    },
    cachedGroupMetadata: async (jid) => await store.getGroupMetadata(jid),
    getMessage: async (key) => await store.getMessage(key)
  });

  if (authState.authMethod === 'pairing' && authState.phoneNumber) {
    try {

      console.log(`\n🔄 Preparing pairing code for +${authState.phoneNumber}...`);
      console.log(`Please wait while we set up the connection...`);
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const phoneNumber = authState.phoneNumber.startsWith('+') 
        ? authState.phoneNumber.substring(1) 
        : authState.phoneNumber;
      
      console.log(`\n🔄 Requesting pairing code for +${phoneNumber}...`); 
      await new Promise(resolve => setTimeout(resolve, 1000));
      const code = await sock.requestPairingCode(phoneNumber);
      if (code) {
        process.stdout.write('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        process.stdout.write(`🔑 YOUR PAIRING CODE: ${code}\n`);
        process.stdout.write('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
        process.stdout.write('Enter this code on your WhatsApp mobile app:\n');
        process.stdout.write('1. Open WhatsApp on your phone\n');
        process.stdout.write('2. Go to Settings > Linked Devices > Link a Device\n');
        process.stdout.write('3. Tap "Link with phone number" at the bottom\n');
        process.stdout.write('4. Enter the pairing code shown above\n\n');
        process.stdout.write('If you see "restart required" message, the bot will automatically restart.\n');
        
        const pairingCodeRestartFlag = {};
        
        sock.ev.on('connection.update', update => {
          const { connection, lastDisconnect } = update;
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          
          if (statusCode === 515 && !pairingCodeRestartFlag.handled) {
            pairingCodeRestartFlag.handled = true;
            
            console.log('\n♻️ Restart required for pairing. Restarting immediately...');
            
            console.log('Please wait while the bot restarts automatically...');
            
            require('../utils/restart').createRestartFlag();
            
            process.nextTick(() => {
              process.exit(0);
            });
          }
        });
      } else {
        throw new Error('No pairing code received from server');
      }
    } catch (error) {
      console.error(`Failed to request pairing code: ${error.message || error}`);
      console.log('\n❌ Failed to request pairing code. Falling back to QR code method...\n');
      sock.ev.emit('connection.update', { qr: true });
    }
  }

  return sock;
};
