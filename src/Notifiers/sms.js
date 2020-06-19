module.exports = class SMS {
  constructor() {
    this.settings = require("../settings");
  }
  isActive() {
    return this.settings.ALERT_SMS == "true";
  }
  sendSMS(text, from, to) {
    if (!isActive()) {
      return;
    }
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
