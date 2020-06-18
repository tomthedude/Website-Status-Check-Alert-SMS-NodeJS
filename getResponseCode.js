const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const WEBSITE_URL = process.env.WEBSITE_URL;
const CHECK_INTERVAL_WHEN_OK = process.env.CHECK_INTERVAL_WHEN_OK;

let interval = CHECK_INTERVAL_WHEN_OK;

checkWebsite(WEBSITE_URL);
//sendSMS();
setInterval(() => {
  result = checkWebsite(WEBSITE_URL);
  if (result != 200) {
    console.log('error '+result);
  } else {
    console.log('alles ok');
  }
},interval * 1000);


function checkWebsite(url) {
  return https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    return res.statusCode;
    //console.log('headers:', res.headers);
  
    res.on('data', (d) => {
      //process.stdout.write(d);
    });
  
  }).on('error', (e) => {
    console.error(e);
  });  
}

function sendSMS() {
  let plivo = require('plivo');
  let client = new plivo.Client();
  client.messages.create(
    '+13322326084',
    '+972556665917',
    'בדיקה'
  ).then(function(message_created) {
    console.log(message_created)
  });
}