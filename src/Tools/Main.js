module.exports = class Main {
  constructor(url, allResults) {
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
    this.notifier = new notifierClass(url, this.logger);
    this.prettyMilliseconds = require("pretty-ms");
    this.https = require("https");
    this.responseTimes = [];
    this.url = url;
    this.resultsFileName =
      this.settings.RESULTS_FOLDER +
      this.url.replace(/[\\/:"*?<>|]+/, "") +
      ".json";
    this.allResults = allResults;
    this.fs = require("fs");
    //this.appendPrevResults();
  }
  appendPrevResults() {
    try {
      this.prevResults = JSON.parse(
        this.fs.readFileSync(this.resultsFileName, "utf8")
      );
      console.log(this.prevResults, "preResults");
      this.allResults[this.url] = { ...this.prevResults };
      this.prevResults = {};
    } catch {}
  }
  checkWebsite(url, interval) {
    var responseTimeStart = new Date();
    var latestStatus = this.latestStatus;
    this.https
      .get(url, {timeout: interval*1000}, (res) => {
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
        }
        if (latestStatus != res.statusCode) {
          this.notifier.notify(res, this.humanReadableStatusDuration);
        }
        this.checkIsCached(res);
        //this.logStats(); -- removed loggin stats as of 17/08, want to implement mysql or nosql insead of gian json file
        //this.showStats();
        //this.logger.logScriptInfo({anotherInteration: true});
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
      })
      .on("error", (e) => {
        e.url = url;
        var latestStatus = this.statusCode;
        this.statusCode = e.code;
        this.handleResponseTime(
          new Date() - responseTimeStart,
          this.statusCode
        );
        this.logStats();
        this.logger.logScriptError(e);
        if (e.code != latestStatus) {
          this.notifier.notify(
            { statusCode: e.code },
            this.humanReadableStatusDuration
          );
        }
        console.log("error with get, url: " + url);
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
      });
  }

  checkIsCached(res) {
    if (this.url == "https://lowchost.co.il") {
      this.isCached =
        typeof res.headers["x-litespeed-cache"] != "undefined" &&
        res.headers["x-litespeed-cache"] == "hit";
    } else {
      this.isCached = false;
    }
  }

  avgResponseTime() {
    let totalTime = 0;
    this.responseTimes.forEach(function (responseTimeObject) {
      totalTime += responseTimeObject.responseTime;
    });
    this.responseTimes.length = Math.max(1, this.responseTimes.length);
    return this.prettyMilliseconds(totalTime / this.responseTimes.length);
  }

  logStats() {
    this.logger.log({
      level: this.getStatusLogLevel(),
      message: this.getStatusLogMessge(),
    });
    var resultObject = {
      time: new Date(),
      URL: this.url,
      statusCode: this.statusCode,
      "status duration": this.humanReadableStatusDuration,
      responseTime: this.prettyMilliseconds(this.responseTimes[0].responseTime),
      "avg response time": this.avgResponseTime(),
      cachedResponse: this.isCached,
    };
    if (!this.allResults[this.url]) {
      this.allResults[this.url] = {};
    }
    this.allResults[this.url][Date.now()] = resultObject;
    try {
      var prevResults = JSON.parse(
        this.fs.readFileSync(this.resultsFileName, "utf8")
      );
    } catch {
      var prevResults = {};
    }

    prevResults[Date.now()] = resultObject;
    this.fs.writeFile(
      this.resultsFileName,
      JSON.stringify(prevResults),
      (err) => {
        if (err) {
          return this.logger.logScriptError({
            result: "fail",
            message: "could not write results to file, " + this.resultsFileName,
            type: "write-to-file",
          });
        }
        this.logger.logScriptError({
          result: "success",
          message: "wrote results to file, " + this.url,
          type: "write-to-file",
        });
        this.allResults[this.url] = {};
      }
    );
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
      time: new Date(),
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
