module.exports = class Notifier {
  constructor(url) {
    this.settings = require("../settings");
    let screenshotClass = require(".././Tools/Screenshot");
    this.screenshotHandler = new screenshotClass(url);
    let smsClass = require(".././Notifiers/sms");
    this.smsHandler = new smsClass();
    let TelegramNotifier = require(".././Notifiers/telegram");
    this.telegramHandler = new TelegramNotifier();
    this.url = url;
  }
  notify(res, humanReadableStatusDuration) {
    //send sms
    var smsText = this.smsHandler.getSMSTextFromStatusCode(
      res.statusCode,
      humanReadableStatusDuration
    );
    smsText += `, url: ${this.url}`;
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
    this.telegramHandler.sendMessage(
      res.statusCode,
      humanReadableStatusDuration,
      this.url
    );
    console.log("error" + res.statusCode);
  }
};
