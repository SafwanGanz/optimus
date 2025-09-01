# Optimus Void WhatsApp Bot
 
Optimus is a modular, enterprise-ready WhatsApp bot built with Node.js. It features a robust plugin system, group management, moderation, and utility commands, making it suitable for both personal and business use.

---

## Features

- **Modular Plugin System:** Easily add, remove, or update features via plugins.
- **Group Management:** Remove, promote, demote users, and update group settings.
- **Moderation Tools:** Ban, mute, and warn users with automated enforcement.
- **Utilities:** Help, ping, and more for bot management and diagnostics.
- **Persistent Storage:** Uses SQLite for reliable data storage.
- **Secure Auth:** Stores WhatsApp session and credentials securely.
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
   git clone https://github.com/SafwanGanz/optimus-void optimus
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
   - On first run, the bot will prompt you to scan a QR code with your WhatsApp app.
   - The session will be saved for future runs.

5. **Start the bot:**
   ```sh
   npm start
   ```

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
| settings     | Update group settings              | `!settings <type> <on|off>`  |
| create       | Create a new group                 | `!create <name> <number>`    |
| leave        | Leave the group                    | `!leave`                     |
| invite       | Generate group invite link         | `!invite`                    |
| info         | Get group information              | `!info`                      |
| mute         | Mute or unmute the group           | `!mute <on|off>`             |
| ban          | Ban users from the group           | `!ban <phone_number>`        |
| warn         | Warn users in the group            | `!warn <phone_number>`       |

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
