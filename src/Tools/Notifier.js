module.exports = class Notifier {
  constructor() {
    this.settings = require("../settings");
    let screenshotClass = require(".././Tools/Screenshot");
    this.screenshotHandler = new screenshotClass();
    let smsClass = require(".././Notifiers/SMS");
    this.smsHandler = new smsClass();
    let TelegramNotifier = require(".././Notifiers/telegram");
    this.telegramHandler = new TelegramNotifier();
  }
  notify(res, humanReadableStatusDuration) {
    smsText = this.smsHandler.getSMSTextFromStatusCode(
      res.statusCode,
      humanReadableStatusDuration
    );

    this.smsHandler.sendSMS(
      smsText,
      this.settings.SENDER_NUMBER,
      this.settings.NOTIFICATION_NUMBER
    );
    this.screenshotHandler.handleScreenShot(
      res.statusCode,
      this.settings.GMAIL_USERNAME
    );
    telegramHandler.sendMessage("Received your message");
    console.log("error" + res.statusCode);
    interval = this.settings.CHECK_INTERVAL_ERROR;
  }
};
