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
    //send sms
    var smsText = this.smsHandler.getSMSTextFromStatusCode(
      res.statusCode,
      humanReadableStatusDuration
    );

    this.smsHandler.sendSMS(
      smsText,
      this.settings.SENDER_NUMBER,
      this.settings.NOTIFICATION_NUMBER
    );

    // send email with screenshot
    this.screenshotHandler.handleScreenShot(
      res.statusCode,
      this.settings.GMAIL_USERNAME,
      humanReadableStatusDuration
    );
    //send telegram
    this.telegramHandler.sendMessage("Received your message");
    console.log("error" + res.statusCode);
  }
};
