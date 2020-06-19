const settings = require("./settings");

const https = require("https");
const prettyMilliseconds = require('pretty-ms');


//settings

let interval = settings.CHECK_INTERVAL_OK;
let latestStatus = null;
let totalStatusTimeSeconds = 0;
let humanReadableStatusDuration = '';

checkWebsite(settings.WEBSITE_URL, interval);

function checkWebsite(url, interval) {
  https
    .get(url, (res) => {
      statusCode = res.statusCode;
      console.log("statusCode:", res.statusCode);
      if (res.statusCode == "200") {
        console.log("alles ok");
        interval = settings.CHECK_INTERVAL_OK;
      } else {
        //sendSMS(getSMSTextFromStatusCode(res.statusCode), settings.SENDER_NUMBER, settings.NOTIFICATION_NUMBER);
        handleScreenShot(res.statusCode, url, settings.GMAIL_USERNAME);
        console.log("error" + res.statusCode);
        interval = settings.CHECK_INTERVAL_ERROR;
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

function handleScreenShot(statusCode, url, recipient) {
  takeAndSendScreenShot(statusCode, url, recipient);
}

function takeAndSendScreenShot(statusCode, url, recipient) {
  const captureWebsite = require('capture-website');
 
  (async () => {
    filename = 'screenshot' + Date.now() + '.png';
  await captureWebsite.file(url, filename);
  sendScreenshot(statusCode, filename, recipient);
})();
}

function sendScreenshot(statusCode, filename, recipient) {
  attachment = [
    {
      filename: "website-screenshot.png",
      path: filename,
    },
  ];
  sendEmail(recipient,
    `web status: ${statusCode}, status duration: ${humanReadableStatusDuration}`,
    `web status: ${statusCode}, status duration: ${humanReadableStatusDuration}`,
    attachment);
}

function sendSMS(text, from, to) {
  let plivo = require("plivo");
  let client = new plivo.Client();
  client.messages
    .create(from, to, text)
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
      user: settings.GMAIL_USERNAME,
      pass: settings.GMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: settings.GMAIL_USERNAME,
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
