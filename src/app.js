var fs = require("fs");

// init
const config = require('config');
let mainAppClass = require("./Tools/Main");
let interval = config.get('Webcheck.CHECK_INTERVAL_OK');

// get websites from json file
var websitesObject = JSON.parse(
  fs.readFileSync(config.get('Webcheck.WEBSITES_FROM_FILE'), "utf8")
);
// add website from .env
websitesObject[config.get('Webcheck.WEBSITES_URL')] = true;

// run
for (url in websitesObject) {
  if (websitesObject[url] != true) {
    continue;
  }
  let mainApp = new mainAppClass(url);
  mainApp.checkWebsite(url, interval);
}


