const settings = require("./settings");
let mainAppClass = require("./Tools/Main");
let mainApp = new mainAppClass();
let interval = settings.CHECK_INTERVAL_OK;

mainApp.checkWebsite(settings.WEBSITE_URL, interval);