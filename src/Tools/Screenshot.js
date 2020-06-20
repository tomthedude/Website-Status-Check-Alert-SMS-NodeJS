module.exports = class Screenshot {
  constructor(url, logger = false) {
    this.settings = require("../settings");
    this.url = url;
    this.logger = logger;
  }
  handleScreenShot(statusCode, recipient, humanReadableStatusDuration) {
    this.humanReadableStatusDuration = humanReadableStatusDuration;
    var EmailNotifier = require(".././Notifiers/email");
    this.emailHandler = new EmailNotifier(this.logger);
    this.takeAndSendScreenShot(statusCode, recipient);
  }

  takeAndSendScreenShot(statusCode, recipient) {
    const captureWebsite = require("capture-website");

    (async () => {
      var filename = "screenshots/screenshot" + Date.now() + ".png";
      await captureWebsite.file(this.url, filename);
      this.sendScreenshot(statusCode, filename, recipient);
    })();
  }

  sendScreenshot(statusCode, filename, recipient) {
    let attachment = [
      {
        filename: "website-screenshot.png",
        path: filename,
      },
    ];
    this.emailHandler.sendEmail(
      recipient,
      `web status: ${statusCode}, url: ${this.url}`,
      `web status: ${statusCode}, status duration: ${this.humanReadableStatusDuration}`,
      attachment
    );
  }
};
