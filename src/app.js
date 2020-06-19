const https = require("https");
const dotenv = require("dotenv");
const prettyMilliseconds = require('pretty-ms');
dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL;
const CHECK_INTERVAL_WHEN_OK = parseInt(process.env.CHECK_INTERVAL_WHEN_OK);
const CHECK_INTERVAL_WHEN_ERROR = parseInt(process.env.CHECK_INTERVAL_WHEN_ERROR);
const SENDER_NUMBER = process.env.SENDER_NUMBER;
const NOTIFICATION_NUMBER = process.env.NOTIFICATION_NUMBER;
const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

let interval = CHECK_INTERVAL_WHEN_OK;
let latestStatus = null;
let totalStatusTimeSeconds = 0;
let humanReadableStatusDuration = '';

checkWebsite(WEBSITE_URL, interval);

function checkWebsite(url, interval) {
  https
    .get(url, (res) => {
      statusCode = res.statusCode;
      console.log("statusCode:", res.statusCode);
      if (res.statusCode == "200") {
        console.log("alles ok");
        interval = CHECK_INTERVAL_WHEN_OK;
      } else {
        //sendSMS(getSMSTextFromStatusCode(res.statusCode));
        handleScreenShot(res.statusCode);
        console.log("error" + res.statusCode);
        interval = CHECK_INTERVAL_WHEN_ERROR;
      }
      handleTiming(statusCode, interval);
      humanReadableStatusDuration = prettyMilliseconds(totalStatusTimeSeconds * 1000);
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

function handleTiming(statusCode, interval) {
  if (latestStatus != statusCode) {
    totalStatusTimeSeconds = 0;
  }
  else {
    totalStatusTimeSeconds += interval; //total minutes
  }
  latestStatus = statusCode;
}

function handleScreenShot(statusCode) {
  takeAndSendScreenShot(statusCode);
}

function takeAndSendScreenShot(statusCode) {
  const captureWebsite = require('capture-website');
 
  (async () => {
    filename = 'screenshot' + Date.now() + '.png';
  await captureWebsite.file(WEBSITE_URL, filename);
  sendScreenshot(statusCode, filename);
})();
}

function sendScreenshot(statusCode, filename) {
  attachment = [
    {
      filename: "website-screenshot.png",
      path: filename,
    },
  ];
  sendEmail(GMAIL_USERNAME,
    `web status: ${statusCode}, status duration: ${humanReadableStatusDuration}`,
    `web status: ${statusCode}, status duration: ${humanReadableStatusDuration}`,
    attachment);
}

function sendSMS(text) {
  let plivo = require("plivo");
  let client = new plivo.Client();
  client.messages
    .create(SENDER_NUMBER, NOTIFICATION_NUMBER, text)
    .then(function (message_created) {
      console.log(message_created);
    });
}

function getSMSTextFromStatusCode(statusCode) {
  switch (statusCode) {
    case 200:
      return `back online, was down for ${humanReadableStatusDuration}, timestamp`;
      break;
    case 500:
      return `error 500, total time: ${humanReadableStatusDuration}, timestamp`;
      break;
    default:
      return `error ${statusCode}, seen for ${humanReadableStatusDuration}, timestamp`;
  }
}

function sendEmail(email, subject, body, attchment = []) {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USERNAME,
      pass: GMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: GMAIL_USERNAME,
    to: email,
    subject: subject,
    html: body,
    attachments: attchment,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
