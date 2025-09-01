
# Optimus Void WhatsApp Bot

Optimus is a modular, enterprise-ready WhatsApp bot built with Node.js. It features a robust plugin system, group management, moderation, and utility commands, making it suitable for both personal and business use.

---

## Features

- **Modular Plugin System:** Easily add, remove, or update features via plugins.
- **Group Management:** Add, remove, promote, demote users, and update group settings.
- **Moderation Tools:** Ban, mute, and warn users with automated enforcement.
- **Media Features:** Play YouTube videos/audio directly in WhatsApp.
- **Utilities:** Help, ping, and more for bot management and diagnostics.
- **Persistent Storage:** Uses SQLite for reliable data storage.
- **Secure Auth:** Stores WhatsApp session and credentials securely.
- **Multiple Authentication Methods:** Connect via QR code or pairing code.
- **Extensible:** Easily add new plugins for custom features.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher (tested on Node.js v24)
- npm (Node Package Manager)
- WhatsApp account (for bot authentication)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd optimus
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure the bot:**
   - Edit `src/config/config.js` to set your command prefix and other settings.
   - Place your WhatsApp authentication files in the `auth_info_optimus_void/` directory (see below for first-time login).

4. **First-time WhatsApp Login:**
   - On first run, the bot will prompt you to choose between QR code or pairing code authentication.
   - For QR code: Scan the displayed QR with your WhatsApp app's linked devices feature.
   - For pairing code: Enter your phone number, then input the displayed code in your WhatsApp app.
   - The session will be saved for future runs.

5. **Start the bot:**
   ```sh
   # On Windows
   start.bat
   
   # On Linux/Mac
   ./start.sh
   ```

---

## Authentication Methods

### QR Code Authentication (Traditional Method)
1. Start the bot and select option 1 when prompted
2. Open WhatsApp on your phone
3. Go to Settings > Linked Devices > Link a Device
4. Scan the QR code displayed in the terminal

### Pairing Code Authentication (New Method)
1. Start the bot and select option 2 when prompted
2. Enter your phone number with country code (e.g., 919876543210)
3. Open WhatsApp on your phone
4. Go to Settings > Linked Devices > Link a Device
5. Tap "Link with phone number" at the bottom
6. Enter the 8-digit pairing code displayed in the terminal

> ⚠️ **IMPORTANT:** You can connect only one device at a time when using pairing code authentication.

> ❗ **IMPORTANT NOTE:** If the bot doesn't restart automatically after entering the pairing code, you may need to restart it manually.

---

## Usage

- Interact with the bot in any WhatsApp group or direct chat where it is a participant.
- Use the configured prefix (default: `!`) before each command.
- Example: `!help` to list all available commands.

### Core Commands

| Command      | Description                        | Usage                        |
|--------------|------------------------------------|------------------------------|
| help         | List all available commands        | `!help`                      |
| ping         | Check bot response time            | `!ping`                      |
| add          | Add users to the group             | `!add <phone_number>`        |
| remove       | Remove users from the group        | `!remove <phone_number>`     |
| promote      | Promote users to admin             | `!promote <phone_number>`    |
| demote       | Demote users from admin            | `!demote <phone_number>`     |
| settings     | Update group settings              | `!settings <type> on/off`    |
| create       | Create a new group                 | `!create <name> <number>`    |
| leave        | Leave the group                    | `!leave`                     |
| invite       | Generate group invite link         | `!invite`                    |
| info         | Get group information              | `!info`                      |
| mute         | Mute or unmute the group           | `!mute <on/>off>`            |
| ban          | Ban users from the group           | `!ban <phone_number>`        |
| warn         | Warn users in the group            | `!warn <phone_number>`       |
| play         | Play YouTube videos/audio          | `!play <YouTube URL/query>`  |

---

## Troubleshooting

### Pairing Code Connection Issues
If you encounter "couldn't connect" errors when using the pairing code:

1. **Phone Number Format:** Make sure to enter your phone number with country code but without the '+' symbol (e.g., 919876543210 not +919876543210)
2. **WhatsApp Version:** Ensure your WhatsApp app is updated to the latest version
3. **Try QR Code Method:** If pairing code fails, the bot will automatically fall back to QR code authentication
4. **Connection Issues:** Make sure you have a stable internet connection
5. **Manual Restart:** If the bot shows "restart required" but doesn't restart automatically, restart it manually
6. **Limited Connections:** Remember that pairing code authentication only supports one connected device at a time

### Common Errors

| Error                      | Solution                                                    |
|----------------------------|-------------------------------------------------------------|
| MODULE_NOT_FOUND           | Make sure all dependencies are installed with `npm install` |
| Connection closed          | Check your internet connection and restart the bot          |
| Logged out from WhatsApp   | Re-authenticate using QR code or pairing code              |
| Auth State Corrupted       | Delete `auth_info_optimus_void` folder and re-authenticate |
| Restart required           | The bot will restart automatically or restart it manually   |

---

## Deployment

### Local/Development
- Run `npm start` to launch the bot locally.
- Use a process manager like [PM2](https://pm2.keymetrics.io/) for auto-restart and monitoring:
  ```sh
  npm install -g pm2
  pm2 start npm --name optimus -- start
  pm2 save
  pm2 startup
  ```

### Production/Enterprise
- Deploy on a secure server (VPS, cloud instance, or container).
- Use environment variables and secrets management for sensitive data.
- Set up automated backups for `optimus_void.db` and `auth_info_optimus_void/`.
- Monitor logs and health with PM2, Docker, or your preferred orchestration tool.
- Regularly update dependencies and plugins for security.

---

## Extending the Bot

- Add new plugins in the `src/plugins/` directory.
- Each plugin should export an object with `command`, `description`, `usage`, and `execute`.
- Register new plugins in the appropriate `index.js` file.

---

## License

This project is licensed under the MIT License.

---
=======
