module.exports = class Screenshot {
  handleScreenShot(statusCode, url, recipient) {
    var EmailNotifier = require(".././Notifiers/email");
    this.emailHandler = new EmailNotifier();
    this.takeAndSendScreenShot(statusCode, url, recipient);
  }

  takeAndSendScreenShot(statusCode, url, recipient) {
    const captureWebsite = require("capture-website");

    (async () => {
      filename = "screenshot" + Date.now() + ".png";
      await captureWebsite.file(url, filename);
      this.sendScreenshot(statusCode, filename, recipient);
    })();
  }

  sendScreenshot(statusCode, filename, recipient) {
    attachment = [
      {
        filename: "website-screenshot.png",
        path: filename,
      },
    ];
    emailHandler.sendEmail(
      recipient,
      `web status: ${statusCode}, status duration: ${humanReadableStatusDuration}`,
      `web status: ${statusCode}, status duration: ${humanReadableStatusDuration}`,
      attachment
    );
  }
};
