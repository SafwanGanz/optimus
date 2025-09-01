const pino = require('pino');

module.exports = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'hostname,pid'
    }
  },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  customLevels: {
    message: 30,
    error: 50
  },
  base: null,
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  messageKey: 'msg',
  mixin: () => {
    return { module: 'optimus' };
  },
  redact: {
    paths: ['*.buffer', '*.ephemeralKeyPair', '*.signedKeyPair', '*.signedPreKey', '*.keyPair', '*._events', '*._eventsCount', '*.attrs'],
    remove: true
  }
});
