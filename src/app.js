var fs = require("fs");

// init
const settings = require("./settings");
let mainAppClass = require("./Tools/Main");
let interval = settings.CHECK_INTERVAL_OK;

class dispalyTable{
  constructor() {
    this.dispalyTable = [["time", "website", "status code", "duration"]];
  }
}

let statsTable = new dispalyTable();

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
  let mainApp = new mainAppClass(url, statsTable);
  mainApp.checkWebsite(url, interval);
}
