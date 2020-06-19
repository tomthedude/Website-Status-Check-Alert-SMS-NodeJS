var fs = require('fs');

// init
const settings = require("./settings");
let mainAppClass = require("./Tools/Main");
let interval = settings.CHECK_INTERVAL_OK;

// get websites from json file
var websitesObject = JSON.parse(fs.readFileSync(settings.WEBSITES_FROM_FILE, 'utf8'));
// add website from .env
websitesObject[settings.WEBSITE_URL] = true;

// run
for (url in websitesObject) {
  if (websitesObject[url] != true) {
    continue;
  }
  let mainApp = new mainAppClass(url);
  mainApp.checkWebsite(url, interval);
}