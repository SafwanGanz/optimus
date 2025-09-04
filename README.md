# Optimus Void WhatsApp Bot

<div align="center">

<img src="https://j.top4top.io/p_3534p2x9q1.png" alt="Optimus Void Logo" width="200" height="200" style="border-radius: 40px">

<h3>A Modular WhatsApp Bot with Rich Features</h3>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/Node.js-18.0.0+-green.svg)](https://nodejs.org/en/download/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white)](https://wa.me/917306771605)
[![Stars](https://img.shields.io/github/stars/SafwanGanz/optimus-void?style=social)](https://github.com/SafwanGanz/optimus-void/stargazers)

---

Optimus is a modular, enterprise-ready WhatsApp bot built with Node.js. It features a robust plugin system, group management, moderation, and utility commands.

[Quick Start](#quick-start) • 
[Features](#features) • 
[Commands](#available-commands) • 
[Deployment](#deployment-options) • 
[Support](#get-help)

</div>

## Quick Start

```bash
# Clone the repository
git clone https://github.com/SafwanGanz/optimus-void.git

# Install dependencies
cd optimus-void
npm install

# Start the bot
npm start
```

## Deploy Now

<div align="center">
    <table>
        <tr>
            <td align="center">
                <a href="https://heroku.com/deploy?template=https://github.com/SafwanGanz/optimus-void">
                    <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku" height="32">
                    <br>Deploy to Heroku
                </a>
            </td>
            <td align="center">
                <a href="https://railway.app/new/template/IS2yRP?referralCode=bINYRC">
                    <img src="https://railway.app/button.svg" alt="Deploy on Railway" height="32">
                    <br>Deploy to Railway
                </a>
            </td>
        </tr>
        <tr>
            <td align="center">
                <a href="https://render.com/deploy?repo=https://github.com/SafwanGanz/optimus-void">
                    <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="32">
                    <br>Deploy to Render
                </a>
            </td>
            <td align="center">
                <a href="https://wa.me/917306771605?text=Hi!%20I%20would%20like%20to%20get%20access%20to%20deploy%20Optimus%20Void%20on%20VotionCloud">
                    <img src="https://img.shields.io/badge/VotionCloud-Request%20Access-blue?style=for-the-badge&logo=v" alt="Request VotionCloud Access" height="32">
                    <br>Request VotionCloud Access
                </a>
            </td>
        </tr>
    </table>
</div>

## Features

- **Modular Plugin System:** Easily add, remove, or update features via plugins
- **Group Management:** Add, remove, promote, demote users, and update group settings
- **Moderation Tools:** Ban, mute, and warn users with automated enforcement
- **Media Features:** Play YouTube videos/audio directly in WhatsApp
- **Utilities:** Help, ping, and more for bot management and diagnostics
- **Persistent Storage:** Uses SQLite for reliable data storage
- **Secure Auth:** Stores WhatsApp session and credentials securely
- **Multiple Authentication Methods:** Connect via QR code or pairing code
- **Extensible:** Easily add new plugins for custom features

## Getting Started

### Prerequisites
- Node.js v18 or higher (tested on Node.js v24)
- npm (Node Package Manager)
- WhatsApp account (for bot authentication)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/SafwanGanz/optimus-void.git
   cd optimus-void
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure the bot:**
   - Edit `.env` file to configure your settings:
     ```env
     BOT_PREFIX=!
     DB_PATH=./optimus_void.db
     BOT_NAME=Optimus-Void
     MENU_IMAGE_URL=https://i.ibb.co/HpKQ6KTc/pic.jpg
     OWNER_NAME=Your Name
     ```

4. **Start the bot:**
   ```sh
   # On Windows
   npm start
   
   # On Linux/Mac
   npm start
   ```

## Creating Plugins

### Plugin Structure
Plugins are organized in the following directories under `src/plugins/`:
- `admin/` - Administrative commands
- `group/` - Group management features
- `moderation/` - Moderation tools
- `utilities/` - Utility functions
- `media/` - Media handling features

### Creating a New Plugin
1. Choose the appropriate directory for your plugin
2. Create a new .js file (e.g., `mycommand.js`)
3. Use this template:

```javascript
const config = require('../../config/config');

module.exports = {
    command: 'commandname',
    description: 'Brief description of what the command does',
    usage: `${config.prefix}commandname <param1> <param2>`,
    execute: async (sock, message, args) => {
        try {
            // Your command logic here
            // sock: WhatsApp connection socket
            // message: Message object containing details about the command
            // args: Array of command arguments
            
            // Send a reply
            return sock.sendMessage(message.key.remoteJid, { 
                text: 'Your response here' 
            }, { 
                quoted: message 
            });
        } catch (error) {
            console.error('Error in commandname:', error);
            return sock.sendMessage(message.key.remoteJid, { 
                text: 'An error occurred!' 
            }, { 
                quoted: message 
            });
        }
    }
};
```

### Plugin Parameters
- `command`: The command name (without prefix)
- `description`: Brief description of what the command does
- `usage`: How to use the command (with parameters if any)
- `execute`: Async function that runs when command is called
  - `sock`: WhatsApp connection socket
  - `message`: Message object containing:
    - `key.remoteJid`: Chat ID
    - `key.fromMe`: If message is from bot
    - `key.participant`: Sender's ID in groups
  - `args`: Array of command arguments

### Example Plugin
Here's a simple greeting plugin:

```javascript
// src/plugins/utilities/greet.js
const config = require('../../config/config');

module.exports = {
    command: 'greet',
    description: 'Sends a greeting message',
    usage: `${config.prefix}greet [name]`,
    execute: async (sock, message, args) => {
        const name = args.join(' ') || 'there';
        return sock.sendMessage(message.key.remoteJid, { 
            text: `Hello, ${name}! 👋` 
        }, { 
            quoted: message 
        });
    }
};
```

## Available Commands

### Admin Commands
| Command   | Description               | Usage                     |
|-----------|---------------------------|---------------------------|
| broadcast | Broadcast a message       | `!broadcast <message>`    |
| eval      | Evaluate JS code         | `!eval <code>`           |
| restart   | Restart the bot          | `!restart`               |

### Group Commands
| Command  | Description                | Usage                      |
|----------|----------------------------|----------------------------|
| add      | Add member to group        | `!add <number>`           |
| kick     | Remove member from group   | `!kick <@mention>`        |
| promote  | Promote to admin          | `!promote <@mention>`     |
| demote   | Demote from admin         | `!demote <@mention>`      |
| setname  | Change group name         | `!setname <new name>`     |
| setdesc  | Change group description  | `!setdesc <description>`  |
| tagall   | Mention all members       | `!tagall [message]`       |
| link     | Get group invite link     | `!link`                   |
| revoke   | Reset group invite link   | `!revoke`                |

### Moderation Commands
| Command | Description              | Usage                     |
|---------|--------------------------|---------------------------|
| warn    | Warn a member           | `!warn <@mention>`        |
| unwarn  | Remove warning          | `!unwarn <@mention>`      |
| warnings| Check warnings          | `!warnings [@mention]`    |
| ban     | Ban member from bot     | `!ban <@mention>`         |
| unban   | Unban member           | `!unban <@mention>`       |

### Utility Commands
| Command | Description              | Usage                     |
|---------|--------------------------|---------------------------|
| help    | Show command list       | `!help [command]`         |
| ping    | Check bot response      | `!ping`                   |
| info    | Show bot info           | `!info`                   |
| sticker | Create sticker          | `!sticker [caption]`      |
| owner   | Show bot owner info     | `!owner`                  |

### Media Commands
| Command | Description              | Usage                     |
|---------|--------------------------|---------------------------|
| play    | Play YouTube audio      | `!play <query/url>`      |
| video   | Download YouTube video  | `!video <query/url>`     |
| ytmp3   | Download YouTube audio  | `!ytmp3 <url>`           |
| ytmp4   | Download YouTube video  | `!ytmp4 <url>`           |

## Deployment Options

### Heroku Deployment
1. **Create a Heroku account and install Heroku CLI**
2. **Login to Heroku:**
   ```sh
   heroku login
   ```
3. **Create a new Heroku app:**
   ```sh
   heroku create your-app-name
   ```
4. **Add buildpacks:**
   ```sh
   heroku buildpacks:add heroku/nodejs
   ```
5. **Configure environment variables:**
   - Go to Settings > Config Vars
   - Add your environment variables from `.env`
6. **Deploy:**
   ```sh
   git push heroku main
   ```

### Railway Deployment
1. **Create a Railway account**
2. **Install Railway CLI:**
   ```sh
   npm i -g @railway/cli
   ```
3. **Login to Railway:**
   ```sh
   railway login
   ```
4. **Initialize project:**
   ```sh
   railway init
   ```
5. **Add environment variables:**
   - Go to your project settings
   - Add variables from your `.env` file
6. **Deploy:**
   ```sh
   railway up
   ```

### Render Deployment
1. **Create a Render account**
2. **Create a new Web Service**
3. **Connect your repository**
4. **Configure the service:**
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add environment variables:**
   - Go to Environment > Environment Variables
   - Add all variables from your `.env` file
6. **Deploy**

### VotionCloud Deployment (Custom)
> Note: This section will be customized by the user

Basic setup:
1. **Create VotionCloud account**
2. **Configure deployment settings**
3. **Set environment variables**
4. **Deploy application**

### Important Deployment Notes
1. **Environment Variables:**
   - Always use environment variables for sensitive data
   - Never commit `.env` file to repository
   - Set up proper environment variables in your deployment platform

2. **Persistent Storage:**
   - Configure persistent storage for `auth_info_optimus_void/`
   - Set up database path for `optimus_void.db`
   - Regular backups recommended

3. **Security Considerations:**
   - Use secure environment variables
   - Enable auto-updates if available
   - Regular monitoring and maintenance
   - Set up proper logging

4. **Performance Optimization:**
   - Configure proper scaling options
   - Set up monitoring
   - Configure auto-restart policies
   - Set up health checks

## Troubleshooting

### Common Issues
1. **Connection Problems**
   - Check your internet connection
   - Delete `auth_info_optimus_void` and reconnect
   - Update WhatsApp on your phone

2. **Command Not Working**
   - Check if command syntax is correct
   - Verify bot has required permissions
   - Check console for error messages

3. **Plugin Loading Issues**
   - Verify plugin file is in correct directory
   - Check for syntax errors
   - Ensure all required fields are exported

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

<div align="center">
    Made with ❤️ by Safwan Ganz
    <br>
    Give this repo a ⭐️ if you found it helpful!
</div>
