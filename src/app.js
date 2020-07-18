var fs = require("fs");

// init
const settings = require("./settings");
let mainAppClass = require("./Tools/Main");
let resultsServerClass = require("./Tools/ResultsServer");
let frontEndServerClass = require("./Tools/FrontEndServer");
let frontEndServer = new frontEndServerClass();
let resulstsServer = new resultsServerClass();
let interval = settings.CHECK_INTERVAL_OK;
let allResults = {};

// get websites from json file
var websitesObject = JSON.parse(
  fs.readFileSync(settings.WEBSITES_FROM_FILE, "utf8")
);
// add website from .env
websitesObject[settings.WEBSITE_URL] = true;

// run
for (url in websitesObject) {
  if (websitesObject[url] != true) {
    continue;
  }
  let mainApp = new mainAppClass(url, allResults);
  mainApp.checkWebsite(url, interval);
}

setInterval(() => {
  var tableResults = [];
  for (url in allResults) {
    for (data in allResults[url]) {
      tableResults.unshift(allResults[url][data]);
    }
  }
  console.table(tableResults);
}, settings.TERMINAL_ALL_RESULTS_INTERVAL * 1000);


//resulstsServer.run();
//frontEndServer.run();