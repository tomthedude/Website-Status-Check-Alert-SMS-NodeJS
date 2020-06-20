const config = require('config');
module.exports = class Main {
  constructor(url) {
    this.totalStatusTimeSeconds = 0;
    this.latestStatus = 200;
    this.humanReadableStatusDuration = "";
    this.statusCode = 200;
    const notifierClass = require("../Tools/Notifier");
    this.notifier = new notifierClass(url);
    this.prettyMilliseconds = require("pretty-ms");
    this.https = require("https");
    this.responseTimes = [];
    this.url = url;
    this.OK_INTERVAL = config.get("Webcheck.CHECK_INTERVAL_OK");
    this.ERROR_INTERVAL = config.get("Webcheck.CHECK_INTERVAL_ERROR");
  }
  checkWebsite(url, interval) {
    var responseTimeStart = new Date();
    this.https
      .get(url, (res) => {
        this.statusCode = res.statusCode;
        this.handleResponseTime(
          new Date() - responseTimeStart,
          this.statusCode
        );
        this.handleTiming(interval);
        this.humanReadableStatusDuration = this.prettyMilliseconds(
          this.totalStatusTimeSeconds * 1000
        );
        if (res.statusCode == "200") {
          interval = this.OK_INTERVAL;
        } else {
          interval = this.ERROR_INTERVAL;
          this.notifier.notify(res, this.humanReadableStatusDuration);
        }
        this.showStats();
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
      })
      .on("error", (e) => {
        console.log("error with get, url: " + url);
      });
  }

  avgResponseTime() {
    let totalTime = 0;
    this.responseTimes.forEach(function (responseTimeObject) {
      totalTime += responseTimeObject.responseTime;
    });
    return this.prettyMilliseconds(totalTime / this.responseTimes.length);
  }

  showStats() {
    console.table({
      time: new Date().toTimeString(),
      URL: this.url,
      statusCode: this.statusCode,
      "status duration": this.humanReadableStatusDuration,
      responseTime: this.prettyMilliseconds(this.responseTimes[0].responseTime),
      "avg response time": this.avgResponseTime(),
    });
  }

  handleResponseTime(responseTime, statusCode) {
    this.responseTimes.unshift({
      statusCode: statusCode,
      responseTime: responseTime,
      timestamp: new Date(),
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
