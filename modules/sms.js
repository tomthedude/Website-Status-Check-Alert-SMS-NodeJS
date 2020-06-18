// modules/sms.js

module.exports = {
  sendSMS: function (text, SENDER_NUMBER, NOTIFICATION_NUMBER) {
    return;
    let plivo = require("plivo");
    let client = new plivo.Client();
    client.messages
      .create(SENDER_NUMBER, NOTIFICATION_NUMBER, text)
      .then(function (message_created) {
        console.log(message_created);
      });
  },

  getSMSTextFromStatusCode: function (statusCode, humanReadableStatusDuration) {
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
  },
};
