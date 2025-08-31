const getAuth = require('./src/utils/auth');
const createSocket = require('./src/services/socket');
const connectionHandler = require('./src/events/connection');
const messagesHandler = require('./src/events/message');
const groupsHandler = require('./src/events/group');
const participantsHandler = require('./src/events/participant');
const logger = require('./src/utils/logger');

async function startOptimusVoid() {
  const { state, saveCreds } = await getAuth();
  const sock = createSocket(state);
  connectionHandler(sock, saveCreds);
  messagesHandler(sock);
  groupsHandler(sock);
  participantsHandler(sock);
  logger.info('Optimus-Void: Initialized');
}

module.exports = startOptimusVoid;
startOptimusVoid();