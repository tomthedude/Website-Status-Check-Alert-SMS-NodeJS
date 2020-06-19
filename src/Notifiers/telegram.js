module.exports = class TelegramNotifier {
  constructor() {
    this.settings = require("../settings");
    const TelegramBot = require("node-telegram-bot-api");
    const token = this.settings.TELEGRAM_BOT_TOKEN;
    this.chatId = this.settings.TELEGRAM_BOT_CHAT_ID;
    this.bot = new TelegramBot(token, { polling: false });
  }
  isActive() {
    return this.settings.ALERT_TELEGRAM == "true";
  }
  sendMessage(message) {
    if (!isActive()) {
      return;
    }
    this.bot.sendMessage(this.chatId, message);
  }
};
