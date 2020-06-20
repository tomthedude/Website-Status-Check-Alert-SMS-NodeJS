module.exports = class TelegramNotifier {
  constructor(url, logger = false) {
    this.settings = require("../settings");
    const TelegramBot = require("node-telegram-bot-api");
    const token = this.settings.TELEGRAM_BOT_TOKEN;
    this.chatId = this.settings.TELEGRAM_BOT_CHAT_ID;
    this.bot = new TelegramBot(token, { polling: false });
    this.url = url;
    this.logger = logger;
  }
  isActive() {
    return this.settings.ALERT_TELEGRAM == "true";
  }
  sendMessage(statusCode, humanReadableStatusDuration) {
    if (!this.isActive()) {
      return;
    }
    var message = "";
    switch (statusCode) {
      case 200:
        message = `all is ok, was warning for ${humanReadableStatusDuration}`;
        break;
      default:
        message = `error! response code ${statusCode}, duration: ${humanReadableStatusDuration}`;
    }
    message += ", url: " + this.url;
    this.bot.sendMessage(this.chatId, message);
    if (this.logger) {
      this.logger.sentTelegram(this);
    }
  }
};
