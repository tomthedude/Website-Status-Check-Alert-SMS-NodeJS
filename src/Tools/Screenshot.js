module.exports = class Screenshot {
  constructor() {
    this.settings = require("../settings");
    this.url = this.settings.WEBSITE_URL;
  }
  handleScreenShot(statusCode, recipient, humanReadableStatusDuration) {
    this.humanReadableStatusDuration = humanReadableStatusDuration;
    var EmailNotifier = require(".././Notifiers/email");
    this.emailHandler = new EmailNotifier();
    this.takeAndSendScreenShot(statusCode, recipient);
  }

  takeAndSendScreenShot(statusCode, recipient) {
    const captureWebsite = require("capture-website");

    (async () => {
      var filename = "screenshot" + Date.now() + ".png";
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
      `web status: ${statusCode}, status duration: ${this.humanReadableStatusDuration}`,
      `web status: ${statusCode}, status duration: ${this.humanReadableStatusDuration}`,
      attachment
    );
  }
};
