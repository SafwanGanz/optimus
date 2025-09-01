const { Boom } = require('@hapi/boom');
const logger = require('./logger');

const rateLimitState = {
  queue: new Map(),
  
  settings: {
    maxRetryAttempts: 3,
    baseDelayMs: 2000,
    maxDelayMs: 30000,
    defaultCooldownMs: 60000,
  }
};

async function withRateLimit(entityId, fn, options = {}) {
  const {
    retryCount = 0,
    maxRetries = rateLimitState.settings.maxRetryAttempts,
    baseDelay = rateLimitState.settings.baseDelayMs,
    forceFresh = false,
    fallbackFn = null,
  } = options;

  const now = Date.now();
  const cooldownInfo = rateLimitState.queue.get(entityId);
  
  if (cooldownInfo && now < cooldownInfo.nextAttempt) {
    logger.debug(`Entity ${entityId} in cooldown. Waiting until ${new Date(cooldownInfo.nextAttempt).toISOString()}`);
    await new Promise(resolve => setTimeout(resolve, cooldownInfo.nextAttempt - now));
  }
  
  try {
    const result = await fn();
    if (cooldownInfo) {
      if (cooldownInfo.retries > 1) {
        rateLimitState.queue.set(entityId, {
          ...cooldownInfo,
          retries: cooldownInfo.retries - 1,
          nextAttempt: now + Math.floor(cooldownInfo.retries * 1000)
        });
      } else {
        rateLimitState.queue.delete(entityId);
      }
    }
    
    return result;
  } catch (error) {
    if (error instanceof Boom && error.data === 429) {
      const delayMs = Math.min(
        baseDelay * Math.pow(2, retryCount) + Math.floor(Math.random() * 1000),
        rateLimitState.settings.maxDelayMs
      );
      const nextAttempt = now + delayMs;
      
      logger.warn(`Rate limit hit for entity ${entityId}, retry ${retryCount + 1}/${maxRetries} in ${delayMs}ms`);
      rateLimitState.queue.set(entityId, {
        nextAttempt,
        retries: (cooldownInfo?.retries || 0) + 1,
        forceFresh: forceFresh
      });
      
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return withRateLimit(entityId, fn, {
          ...options,
          retryCount: retryCount + 1
        });
      } else {
        logger.error(`Max retries reached for entity ${entityId}`);
        
        if (typeof fallbackFn === 'function') {
          logger.info(`Using fallback function for entity ${entityId}`);
          return fallbackFn();
        }
        
        throw new Error(`Rate limit exceeded for ${entityId} after ${maxRetries} attempts`);
      }
    }
    
    throw error;
  }
}

async function getGroupMetadataWithRateLimit(sock, groupId, store) {
  return withRateLimit(
    `group-${groupId}`,
    async () => {
      const metadata = await sock.groupMetadata(groupId);
      await store.saveGroupMetadata(groupId, metadata);
      return metadata;
    },
    {
      fallbackFn: async () => {
        const metadata = await store.getGroupMetadata(groupId);
        if (!metadata) {
          throw new Error(`No cached metadata available for group ${groupId}`);
        }
        return metadata;
      }
    }
  );
}

async function groupParticipantsUpdateWithRateLimit(sock, groupId, participants, action) {
  return withRateLimit(
    `group-participant-${groupId}-${action}`,
    async () => {
      return sock.groupParticipantsUpdate(groupId, participants, action);
    }
  );
}

function clearRateLimitState() {
  rateLimitState.queue.clear();
}

module.exports = {
  withRateLimit,
  getGroupMetadataWithRateLimit,
  groupParticipantsUpdateWithRateLimit,
  clearRateLimitState,
  getRateLimitState: () => rateLimitState,
};
