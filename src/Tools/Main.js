module.exports = class Main {
  constructor(url, statsTable) {
    this.settings = require("../settings");
    this.totalStatusTimeSeconds = 0;
    this.latestStatus = 200;
    this.humanReadableStatusDuration = "";
    this.statusCode = 200;
    const notifierClass = require("../Tools/Notifier");
    this.notifier = new notifierClass(url);
    this.prettyMilliseconds = require("pretty-ms");
    this.https = require("https");
    this.currentStatusStats = { url: url, statusCode: 200, duration: 0 };
      this.responseTimes = {};
      this.tableObject = {};
      this.url = url;
      this.statsTable = statsTable;
      var blessed = require('blessed');

      // Create a screen object.
      var screen = blessed.screen({
        smartCSR: true
      });
      
            screen.title = 'my window title';
      this.table = blessed.table();
      this.table.setData(this.statsTable.dispalyTable);
      screen.append(this.table);
  }
  addEntryToTable() {
    //this.statsTable.dispalyTable.push([Date.now(), this.url, this.statusCode, this.humanReadableStatusDuration]);
  }
  showStats() {
      //this.statsTable.dispalyTable[0] = [Date.now(), this.url, this.statusCode, this.humanReadableStatusDuration];
      this.table.setData(this.statsTable.dispalyTable);
  }
    checkWebsite(url, interval) {
        var responseTimeStart = new Date();
        
    this.https
        .get(url, (res) => {
            var responseTime = new Date() - responseTimeStart;
            this.responseTimes[new Date()] = responseTime;
        this.statusCode = res.statusCode;
        this.handleTiming(interval);
        this.humanReadableStatusDuration = this.prettyMilliseconds(
          this.totalStatusTimeSeconds * 1000
        );
        this.currentStatusStats.duration = this.humanReadableStatusDuration;
        //console.log("statusCode:", res.statusCode);
        if (res.statusCode == "200") {
          //console.log("alles ok, " + url);
          interval = this.settings.CHECK_INTERVAL_OK;
        } else {
          interval = this.settings.CHECK_INTERVAL_ERROR;
          this.notifier.notify(res, this.humanReadableStatusDuration);
        }
        // console.log(
        //   `total status time: ${this.humanReadableStatusDuration}, url: ${url}`
        // );
        this.showStats();
        setTimeout(() => {
          this.checkWebsite(url, interval);
        }, interval * 1000);
        //console.log('headers:', res.headers);
      })
      .on("error", (e) => {
        console.log("error with get, stopping checks, url: " + url);
        //console.error(e);
      });
  }

  handleTiming(interval) {
    if (this.latestStatus != this.statusCode) {
      this.addEntryToTable();
      this.totalStatusTimeSeconds = 0;
    } else {
      this.totalStatusTimeSeconds += interval; //total minutes
    }
    this.currentStatusStats.statusCode = this.statusCode;
    this.latestStatus = this.statusCode;
  }
};
