var fs = require('fs');
const settings = require("./settings");
let mainAppClass = require("./Tools/Main");
let interval = settings.CHECK_INTERVAL_OK;
var websitesObject = JSON.parse(fs.readFileSync(settings.WEBSITES_FROM_FILE, 'utf8'));
websitesObject[settings.WEBSITE_URL] = true;
for (url in websitesObject) {
  if (websitesObject[url] != true) {
    continue;
  }
  let mainApp = new mainAppClass(url);
  mainApp.checkWebsite(url, interval);
}