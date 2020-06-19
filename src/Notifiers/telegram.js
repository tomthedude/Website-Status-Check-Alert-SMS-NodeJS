module.exports = class TelegramNotifier {
  constructor() {
    this.settings = require("../settings");
    const TelegramBot = require("node-telegram-bot-api");
    const toekn = this.settings.TELEGRAM_BOT_TOKEN;
    this.chatId = this.settings.TELEGRAM_BOT_CHAT_ID;
    this.bot = new TelegramBot(token, { polling: false });
  }
  sendMessage(message) {
    this.bot.sendMessage(this.chatId, message);
  }
};
