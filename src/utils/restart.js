const logger = require('./logger');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

let isRestartScheduled = false;
let restartTimer = null;
function scheduleRestart(delay = 1000, reason = 'Automatic restart') {
  if (isRestartScheduled) {
    logger.info(`Restart already scheduled. Ignoring additional restart request for reason: ${reason}`);
    return;
  }
  global.isRestarting = true;
  isRestartScheduled = true;
  logger.info(`Scheduling restart in ${delay}ms. Reason: ${reason}`);
  console.log(`\n🔄 Bot will restart automatically in ${delay/1000} second(s)...`);
  if (restartTimer) {
    clearTimeout(restartTimer);
  }
  

  restartTimer = setTimeout(() => {
    logger.info(`Executing scheduled restart. Reason: ${reason}`);
    console.log('🔄 Restarting now...');
    
    try {
      const isWindows = process.platform === 'win32';
      const rootDir = path.resolve(__dirname, '..', '..');
      
      if (isWindows) {
        if (fs.existsSync(path.join(rootDir, 'start.bat'))) {
          child_process.spawn('cmd.exe', ['/c', 'start.bat'], {
            detached: true,
            stdio: 'ignore',
            cwd: rootDir
          }).unref();
        }
      } else {
        if (fs.existsSync(path.join(rootDir, 'start.sh'))) {
          fs.chmodSync(path.join(rootDir, 'start.sh'), '755');
          child_process.spawn('./start.sh', [], {
            detached: true,
            stdio: 'ignore',
            cwd: rootDir
          }).unref();
        }
      }
    } catch (e) {
      logger.error(`Failed to spawn restart process: ${e.message}`);
    }
    process.exit(0);
  }, delay);
  
  setTimeout(() => {
    if (isRestartScheduled) {
      logger.error('Forced restart due to timeout');
      console.log('⚠️ Forcing restart after timeout...');
      
      process.kill(process.pid, 'SIGKILL');
    }
  }, delay + 5000);
  
  return true;
}

function cancelRestart() {
  if (isRestartScheduled && restartTimer) {
    clearTimeout(restartTimer);
    isRestartScheduled = false;
    global.isRestarting = false;
    logger.info('Scheduled restart cancelled');
  }
}

function setupSignalHandlers() {
  process.on('SIGINT', () => {
    logger.info('Received SIGINT. Shutting down gracefully...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM. Shutting down gracefully...');
    process.exit(0);
  });
}

function createRestartFlag() {
  try {
    const rootDir = path.resolve(__dirname, '..', '..');
    const restartFlagPath = path.join(rootDir, '.restart_needed');
    fs.writeFileSync(restartFlagPath, Date.now().toString());
    return true;
  } catch (e) {
    logger.error(`Failed to create restart flag: ${e.message}`);
    return false;
  }
}

setupSignalHandlers();

module.exports = {
  scheduleRestart,
  cancelRestart,
  createRestartFlag
};
