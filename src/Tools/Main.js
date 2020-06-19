module.exports = class Main {
  constructor() {
    this.settings = require("../settings");
    this.totalStatusTimeSeconds = 0;
    this.latestStatus = 200;
    this.humanReadableStatusDuration = "";
    this.statusCode = 200;
    const notifierClass = require("../Tools/Notifier");
    this.notifier = new notifierClass();
  }
  checkWebsite(url, interval) {
    const https = require("https");
    const prettyMilliseconds = require("pretty-ms");

    https
      .get(url, (res) => {
        this.statusCode = res.statusCode;
        console.log("statusCode:", res.statusCode);
        if (res.statusCode != "200") {
          console.log("alles ok");
          interval = this.settings.CHECK_INTERVAL_OK;
        } else {
          this.notifier.notify(res, this.humanReadableStatusDuration);
          var interval = this.settings.CHECK_INTERVAL_ERROR;
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
