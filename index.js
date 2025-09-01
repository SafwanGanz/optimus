const getAuth = require('./src/utils/auth');
const createSocket = require('./src/services/socket');
const connectionHandler = require('./src/events/connection');
const messagesHandler = require('./src/events/message');
const groupsHandler = require('./src/events/group');
const participantsHandler = require('./src/events/participant');
const logger = require('./src/utils/logger');
const { scheduleRestart } = require('./src/utils/restart');

global.isRestarting = false;

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  
  if (err.message.includes('restart required') || 
      err.message.includes('connection closed') ||
      err.message.includes('WebSocket') ||
      err.message.includes('Baileys')) {
    logger.info('Detected restartable error. Initiating restart...');
    scheduleRestart(1500, `Uncaught exception: ${err.message}`);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise);
  logger.error(`Reason: ${reason}`);
  
  if (reason && typeof reason === 'object' && 
      (reason.message?.includes('restart required') || 
       reason.message?.includes('connection closed') ||
       reason.message?.includes('WebSocket') ||
       reason.message?.includes('Baileys'))) {
    logger.info('Detected restartable promise rejection. Initiating restart...');
    scheduleRestart(1500, `Unhandled rejection: ${reason.message}`);
  }
});

async function startOptimusVoid() {
  try {

    const { state, saveCreds } = await getAuth();
    const sock = await createSocket(state);
    sock.authState = state;
    connectionHandler(sock, saveCreds);
    messagesHandler(sock);
    groupsHandler(sock);
    participantsHandler(sock);
    
    logger.info('Optimus-Void: Initialized');
    
    sock.ev.on('connection.update', update => {
      if (update.connection === 'close' && 
          update.lastDisconnect?.error?.output?.statusCode === 515) {
        
        logger.info('Connection indicates restart required. Will auto-restart...');
        scheduleRestart(1000, 'Restart required from main handler');
      }
    });
    
    return sock;
  } catch (error) {
    logger.error(`Failed to start Optimus-Void: ${error.message}`);
    if (error.message.includes('restart required') || 
        error.message.includes('connection closed') ||
        error.message.includes('pairing code')) {
      logger.info('Restarting due to initialization error...');
      scheduleRestart(1500, `Initialization error: ${error.message}`);
    } else {
      process.exit(1);
    }
  }
}

module.exports = startOptimusVoid;

startOptimusVoid().catch(err => {
  console.error('Fatal error starting bot:', err);
  if (err.message && (
      err.message.includes('restart required') || 
      err.message.includes('connection closed') ||
      err.message.includes('pairing code'))) {
    console.log('Detected recoverable error. Initiating restart...');
    scheduleRestart(1000, `Bot startup error: ${err.message}`);
  } else {
    process.exit(1);
  }
});
