const store = require('../utils/store');
const logger = require('../utils/logger');
const { Boom } = require('@hapi/boom');

const RATE_LIMIT_QUEUE = new Map();
const MAX_RETRY_ATTEMPTS = 3;
const BASE_DELAY_MS = 2000;

async function fetchGroupMetadataWithRetry(sock, groupId, retryCount = 0) {
  const now = Date.now();
  const cooldownInfo = RATE_LIMIT_QUEUE.get(groupId);
  
  if (cooldownInfo && now < cooldownInfo.nextAttempt) {
    logger.debug(`Group ${groupId} in cooldown. Waiting until ${new Date(cooldownInfo.nextAttempt).toISOString()}`);
    await new Promise(resolve => setTimeout(resolve, cooldownInfo.nextAttempt - now));
  }
  
  try {
    let metadata = await store.getGroupMetadata(groupId);
    if (!metadata || (cooldownInfo && cooldownInfo.forceRefresh)) {
      logger.debug(`Fetching fresh metadata for group ${groupId}`);
      metadata = await sock.groupMetadata(groupId);
      await store.saveGroupMetadata(groupId, metadata);
    }
    
    RATE_LIMIT_QUEUE.delete(groupId);
    return metadata;
  } catch (error) {
    if (error instanceof Boom && error.data === 429) {
      const delayMs = BASE_DELAY_MS * Math.pow(2, retryCount);
      const jitter = Math.floor(Math.random() * 1000); 
      const nextAttempt = now + delayMs + jitter;
      
      logger.warn(`Rate limit hit for group ${groupId}, retry ${retryCount + 1}/${MAX_RETRY_ATTEMPTS} in ${delayMs}ms`);
      
      RATE_LIMIT_QUEUE.set(groupId, {
        nextAttempt,
        retries: (cooldownInfo?.retries || 0) + 1,
        forceRefresh: false
      });
      
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, delayMs + jitter));
        return fetchGroupMetadataWithRetry(sock, groupId, retryCount + 1);
      } else {
        logger.error(`Max retries reached for group ${groupId}, using cached data if available`);
        return await store.getGroupMetadata(groupId);
      }
    }
    
    if (error.data === 403) {
      logger.warn(`Forbidden: Cannot access metadata for group ${groupId}`);
    } else {
      logger.error(`Error fetching group metadata for ${groupId}:`, error);
    }
    
    return await store.getGroupMetadata(groupId);
  }
}

module.exports = (sock) => {
  sock.ev.on('group-participants.update', async (event) => {
    if (!event || !event.id) return;
    
    try {
      const { id, participants, action } = event;

      const groupIdFormatted = id.split('@')[0];

      const participantsFormatted = participants.map(p => p.split('@')[0]).join(', ');

      switch (action) {
        case 'add':
          logger.info(`👥 GROUP [${groupIdFormatted}]: Added participant(s): ${participantsFormatted}`);
          break;
        case 'remove':
          logger.info(`👥 GROUP [${groupIdFormatted}]: Removed participant(s): ${participantsFormatted}`);
          break;
        case 'promote':
          logger.info(`👥 GROUP [${groupIdFormatted}]: Promoted participant(s) to admin: ${participantsFormatted}`);
          break;
        case 'demote':
          logger.info(`👥 GROUP [${groupIdFormatted}]: Demoted participant(s) from admin: ${participantsFormatted}`);
          break;
        default:
          logger.info(`👥 GROUP [${groupIdFormatted}]: ${action} participant(s): ${participantsFormatted}`);
      }
      const metadata = await fetchGroupMetadataWithRetry(sock, id);
    
    } catch (error) {
      logger.error(`Error in group-participants handler: ${error.message || error}`);
    }
  });
};
