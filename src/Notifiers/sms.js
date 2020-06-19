module.exports = class SMS {
  sendSMS(text, from, to) {
    let plivo = require("plivo");
    let client = new plivo.Client();
    client.messages.create(from, to, text).then(function (message_created) {
      console.log(message_created);
    });
  }

  getSMSTextFromStatusCode(statusCode, humanReadableStatusDuration) {
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
};
