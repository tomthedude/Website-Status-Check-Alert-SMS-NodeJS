module.exports = class Main {
  constructor(url) {
    this.settings = require("../settings");
    this.totalStatusTimeSeconds = 0;
    this.latestStatus = 200;
    this.humanReadableStatusDuration = "";
    this.statusCode = 200;
    const notifierClass = require("../Tools/Notifier");
    this.notifier = new notifierClass(url);
    this.prettyMilliseconds = require("pretty-ms");
    this.https = require("https");
  }
  checkWebsite(url, interval) {
    this.https
      .get(url, (res) => {
        this.statusCode = res.statusCode;
        this.handleTiming(interval);
        this.humanReadableStatusDuration = this.prettyMilliseconds(
          this.totalStatusTimeSeconds * 1000
        );
        console.log("statusCode:", res.statusCode);
        if (res.statusCode == "200") {
          console.log("alles ok, " + url);
          interval = this.settings.CHECK_INTERVAL_OK;
        } else {
          interval = this.settings.CHECK_INTERVAL_ERROR;
          this.notifier.notify(res, this.humanReadableStatusDuration);
        }
        console.log(
          `total status time: ${this.humanReadableStatusDuration}, url: ${url}`
        );
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
        //console.log('headers:', res.headers);
      })
      .on("error", (e) => {
        console.log("error with get, url: " + url);
        //console.error(e);
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
