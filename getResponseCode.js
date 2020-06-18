const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL;
const CHECK_INTERVAL_WHEN_OK = process.env.CHECK_INTERVAL_WHEN_OK;
const CHECK_INTERVAL_WHEN_ERROR = process.env.CHECK_INTERVAL_WHEN_ERROR;
const SENDER_NUMBER = process.env.SENDER_NUMBER;

let interval = CHECK_INTERVAL_WHEN_OK;

checkWebsite(WEBSITE_URL);


function checkWebsite(url, interval) {
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    if (res.statusCode == "200") {
      console.log("alles ok");
      interval = CHECK_INTERVAL_WHEN_OK;
    } else {
      sendSMS(res.statusCode);
      sendScreenshot(res);
      console.log('error' + res.statusCode);
      interval = CHECK_INTERVAL_WHEN_ERROR;
    }
    setTimeout(() => {
      checkWebsite(url, interval);
    }, interval * 1000);
    //console.log('headers:', res.headers);
  }).on('error', (e) => {
    console.error(e);
  });  
}

function sendScreenshot(res, mail){
      res.on('data', (d) => {
      //process.stdout.write(d);
        console.log('screen shot sent to mail');
    });
}

function sendSMS(reciever, text) {
  let plivo = require('plivo');
  let client = new plivo.Client();
  client.messages.create(
    SENDER_NUMBER,
    reciever,
    text
  ).then(function(message_created) {
    console.log(message_created)
  });
}