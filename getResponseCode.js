const https = require("https");
const dotenv = require("dotenv");
const prettyMilliseconds = require("pretty-ms");
var smsHandler = require("./modules/sms");
var screenshotHandler = require("./modules/screenshots");
var statusTimeHandler = require("./modules/status-timings");
dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL;
const CHECK_INTERVAL_WHEN_OK = parseInt(process.env.CHECK_INTERVAL_WHEN_OK);
const CHECK_INTERVAL_WHEN_ERROR = parseInt(
  process.env.CHECK_INTERVAL_WHEN_ERROR
);
const SENDER_NUMBER = process.env.SENDER_NUMBER;
const NOTIFICATION_NUMBER = process.env.NOTIFICATION_NUMBER;
const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

let interval = CHECK_INTERVAL_WHEN_OK;
let latestStatus = null;
let totalStatusTimeSeconds = 0;
let humanReadableStatusDuration = "";

checkWebsite(WEBSITE_URL, interval);

function checkWebsite(url, interval) {
  https
    .get(url, (res) => {
      statusCode = res.statusCode;
      console.log("statusCode:", res.statusCode);
      if (res.statusCode != "200") {
        console.log("alles ok");
        interval = CHECK_INTERVAL_WHEN_OK;
      } else {
        smsHandler.sendSMS(
          smsHandler.getSMSTextFromStatusCode(
            res.statusCode,
            humanReadableStatusDuration
          ),
          SENDER_NUMBER,
          NOTIFICATION_NUMBER
        );
        screenshotHandler.handleScreenShot(
          res.statusCode,
          WEBSITE_URL,
          humanReadableStatusDuration,
          GMAIL_USERNAME
        );
        console.log("error" + res.statusCode);
        interval = CHECK_INTERVAL_WHEN_ERROR;
      }
      inta = statusTimeHandler.handleTiming(latestStatus, statusCode, interval);
      if (inta > 0) {
        totalStatusTimeSeconds += inta;
      } else {
        totalStatusTimeSeconds = 0;
      }
      humanReadableStatusDuration = prettyMilliseconds(
        totalStatusTimeSeconds * 1000
      );
      latestStatus = statusCode;
      console.log(`total status time: ${humanReadableStatusDuration}`);
      setTimeout(() => {
        checkWebsite(url, interval);
      }, interval * 1000);
      //console.log('headers:', res.headers);
    })
    .on("error", (e) => {
      console.error(e);
    });
}
