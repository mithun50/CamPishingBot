## CamPishingBot
CamPishingBot is a Telegram bot designed to simulate phishing scenarios and provide security awareness training. This bot supports URL shortening, user interaction tracking, and various administrative controls.

## Features
- **Phishing Simulation**: Simulate phishing attempts to educate users about security threats.
- **Interaction Tracking**: Monitor and log interactions with the bot.

## Installation

To set up CamPishingBot locally, follow these steps:

**Required Packages:**
   ```bash
    pkg install nodejs
```

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/mithun50/CamPishingBot.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd CamPishingBot
   ```

3. **Install Dependencies:**
   Ensure you have Node.js installed. Install the required packages using npm:
   ```bash
   npm install
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file in the project root and add your Telegram bot token and other configurations:
   ```env
   TGBToken=your-telegram-bot-token
   HOST_URL=your-host-url
   ADMIN_TELEGRAM_ID=your-admin-telegram-id (Optional: See Admin Functionality section)
   TELEGRAM_BOT_LINK=your-telegram-bot-profile-link (Optional: See Root Endpoint Configuration section)
   ```

5. **Run the Bot:**
   Start the bot with:
   ```bash
   node index.js
   ```

6. **Interact with the Bot:**
   Start a conversation with your bot on Telegram using the username specified in your bot's settings.

## Usage

- **Start the Bot**: Use `npm start` to run the bot and interact with it on Telegram.
- **Phishing Simulation**: Use the bot to simulate phishing scenarios and track responses.
- **Port Forwarding**: Use the Port forwarding tools like ngrok.

## Configuration

Adjust settings and configurations as needed in the code or via environment variables in the `.env` file.

### Root Endpoint Configuration
The root `/` endpoint of the web server can be configured using the `TELEGRAM_BOT_LINK` environment variable:
- **`TELEGRAM_BOT_LINK`**: If this variable is set in your `.env` file (e.g., `TELEGRAM_BOT_LINK=https://t.me/yourbotusername`), visiting the root URL of the server (e.g., `http://yourhosturl/`) will display a simple page with a link to your Telegram bot.
- If `TELEGRAM_BOT_LINK` is not set, the root URL will display an "I am alive" status page.

### Admin Functionality
This tool includes features for an administrator, configured via the `ADMIN_TELEGRAM_ID` environment variable.

**1. Admin Notifications for Collected Data:**
   To enable receiving copies of all data collected by the bot:
    1. Ensure your `.env` file is in the root directory.
    2. Add/ensure the following line is in your `.env` file:
       ```env
       ADMIN_TELEGRAM_ID=YOUR_ADMIN_TELEGRAM_ID
       ```
       Replace `YOUR_ADMIN_TELEGRAM_ID` with the actual Telegram ID of the admin user.
    3. The `dotenv` package loads this variable (handled in `index.js`).

   When configured, the admin will receive:
    - Location data, along with the ID and Telegram username/name of the user who generated the link.
    - Device information, along with the ID and Telegram username/name of the user who generated the link.
    - Camera snaps, along with the ID and Telegram username/name of the user who generated the link.

   If `ADMIN_TELEGRAM_ID` is not set, these admin-specific notifications are disabled, and the bot functions normally for users.

**2. `/admin` Command:**
   If `ADMIN_TELEGRAM_ID` is set, the designated admin user can use the `/admin` command in the Telegram bot.
   - **Purpose:** To get a report about bot usage.
   - **Output:**
     - Total number of unique users who have interacted with the bot (e.g., used `/start` or `/create`).
     - A list of these users, including their Telegram ID, Username (if available, otherwise First Name), and the count of links they have created.
   - **Access:** This command can only be successfully invoked by the user whose Telegram ID matches `ADMIN_TELEGRAM_ID`. Other users attempting to use it will receive an "unauthorized" message.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Me
<div align="left">
  <a href="malio:mithungowda.b7411@gmail.com" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Gmail&logo=gmail&label=&color=D14836&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="gmail logo"  />
  </a>
  <a href="http://instagram.com/mithun.gowda.b" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Instagram&logo=instagram&label=&color=E4405F&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="instagram logo"  />
  </a>
  <a href="https://t.me/@MITHUNGOWDA_B" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Telegram&logo=telegram&label=&color=2CA5E0&logoColor=white&labelColor=&style=for-the-badge" height="35" alt="telegram logo"  />
  </a>
</div>

## Screenshots

![Screenshot 1](https://github.com/mithun50/CamPishingBot/raw/main/assets/screenshots/scc1.png)
![Screenshot 2](https://github.com/mithun50/CamPishingBot/raw/main/assets/screenshots/scc2.png)
![Screenshot 3](https://github.com/mithun50/CamPishingBot/raw/main/assets/screenshots/scc3.png)
![Screenshot 4](https://github.com/mithun50/CamPishingBot/raw/main/assets/screenshots/scc4.png)
![Screenshot 5](https://github.com/mithun50/CamPishingBot/raw/main/assets/screenshots/scc5.png)
**The End**
