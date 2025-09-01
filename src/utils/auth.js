const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const isFirstTimeAuth = () => {
  const authDir = 'auth_info_optimus_void';
  if (!fs.existsSync(authDir)) return true;
  
  const credsFile = path.join(authDir, 'creds.json');
  return !fs.existsSync(credsFile);
};

const question = (query) => new Promise((resolve) => rl.question(query, resolve));
const validatePhoneNumber = (phoneNumber) => {
  const cleanNumber = phoneNumber.trim().replace(/[^0-9]/g, '');
  
  if (cleanNumber.length < 10) {
    return { valid: false, message: 'Phone number is too short. Please include country code.' };
  }
  
  return { valid: true, number: cleanNumber };
};

module.exports = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_optimus_void');
  
  state.authMethod = 'qr';
  
  if (isFirstTimeAuth()) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🤖 OPTIMUS-VOID | FIRST TIME AUTHENTICATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Choose authentication method:');
    console.log('1. Scan QR Code (default)');
    console.log('2. Use Pairing Code');
    
    const choice = await question('\nEnter your choice (1 or 2): ');
    
    if (choice === '2') {
      state.authMethod = 'pairing';
      console.log('\nYou selected pairing code authentication.');
      console.log('\nIMPORTANT: Your phone number must include country code WITHOUT the + symbol');
      console.log('Example: For +91 98765xxxxx, enter 919876543210');
      
      let isValidNumber = false;
      let phoneNumber;
      
      while (!isValidNumber) {
        phoneNumber = await question('\nEnter your phone number with country code: ');
        const validation = validatePhoneNumber(phoneNumber);
        
        if (validation.valid) {
          isValidNumber = true;
          phoneNumber = validation.number;
        } else {
          console.log(`\n❌ ${validation.message} Please try again.`);
        }
      }
      
      state.phoneNumber = phoneNumber;
      console.log(`\n✅ Phone number set: +${state.phoneNumber}`);
    } else {
      console.log('\nYou selected QR code authentication.');
    }
  }
  
  return { state, saveCreds };
};
