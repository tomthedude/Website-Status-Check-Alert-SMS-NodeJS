module.exports = class Main {
  constructor(url) {
    this.loggerLevelsMap = {
      200: "info",
      300: "info",
    };
    this.settings = require("../settings");
    const loggerClass = require("./Logger");
    this.logger = new loggerClass(url);
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
          interval = this.settings.CHECK_INTERVAL_OK;
        } else {
          interval = this.settings.CHECK_INTERVAL_ERROR;
          this.notifier.notify(res, this.humanReadableStatusDuration);
        }
        this.logStats();
        this.showStats();
        //this.logger.logScriptInfo({anotherInteration: true});
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
      })
      .on("error", (e) => {
        e.url = url;
        this.logger.logScriptError(e);
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

  logStats() {
    this.logger.log({
      level: this.getStatusLogLevel(),
      message: this.getStatusLogMessge(),
    });
    console.log(`logged ${this.statusCode} / ${this.url}`);
  }

  getStatusLogLevel() {
    return typeof this.loggerLevelsMap[this.statusCode] == "undefined"
      ? "error"
      : this.loggerLevelsMap[this.statusCode];
  }

  getStatusLogMessge() {
    var data = {
      responseCode: this.statusCode,
      responseTime: this.responseTimes[0],
      timestamp: new Date(),
      url: this.url,
      statusDuration: this.totalStatusTimeSeconds,
      avgResponseTime: this.avgResponseTime(),
    };
    return JSON.stringify(data);
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
