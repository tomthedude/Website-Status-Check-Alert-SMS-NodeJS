module.exports = class Notifier {
  constructor(url, logger = false) {
    this.logger = logger;
    this.url = url;
    this.settings = require("../settings");
    let screenshotClass = require(".././Tools/Screenshot");
    this.screenshotHandler = new screenshotClass(this.url, this.logger);
    let smsClass = require(".././Notifiers/sms");
    this.smsHandler = new smsClass(this.url, this.logger);
    let TelegramNotifier = require(".././Notifiers/telegram");
    this.telegramHandler = new TelegramNotifier(this.url, this.logger);
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
      humanReadableStatusDuration
    );
    console.log("error" + res.statusCode);
  }
};
