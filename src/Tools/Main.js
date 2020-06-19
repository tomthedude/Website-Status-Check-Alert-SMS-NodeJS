module.exports = class Main {
  constructor() {
    this.settings = require("../settings");
    this.totalStatusTimeSeconds = 0;
    this.latestStatus = 200;
    this.humanReadableStatusDuration = "";
    this.statusCode = 200;
  }
  checkWebsite(url, interval) {
    const https = require("https");
    const prettyMilliseconds = require("pretty-ms");

    let screenshotClass = require(".././Tools/Screenshot");
    let screenshotHandler = new screenshotClass();
    let smsClass = require(".././Notifiers/SMS");
    let smsHandler = new smsClass();

    https
      .get(url, (res) => {
        this.statusCode = res.statusCode;
        console.log("statusCode:", res.statusCode);
        if (res.statusCode == "200") {
          console.log("alles ok");
          interval = this.settings.CHECK_INTERVAL_OK;
        } else {
          smsText = smsHandler.getSMSTextFromStatusCode(
            res.statusCode,
            this.humanReadableStatusDuration
          );
          smsHandler.sendSMS(
            smsText,
            this.settings.SENDER_NUMBER,
            this.settings.NOTIFICATION_NUMBER
          );
          screenshotHandler.handleScreenShot(
            res.statusCode,
            url,
            settings.GMAIL_USERNAME
          );
          console.log("error" + res.statusCode);
          interval = this.settings.CHECK_INTERVAL_ERROR;
        }
        this.humanReadableStatusDuration = prettyMilliseconds(
          this.totalStatusTimeSeconds * 1000
        );
        this.handleTiming(interval);
        console.log(`total status time: ${this.humanReadableStatusDuration}`);
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
        //console.log('headers:', res.headers);
      })
      .on("error", (e) => {
        console.error(e);
      });
  }

  handleTiming(interval) {
    if (this.latestStatus != this.statusCode) {
      this.totalStatusTimeSeconds = 0;
    } else {
      this.totalStatusTimeSeconds += interval; //total minutes
    }
    this.latestStatus = this.statusCode;
  }
};
