module.exports = {
  handleScreenShot: function (statusCode, WEBSITE_URL, humanReadableStatusDuration, GMAIL_USERNAME) {
    takeAndSendScreenShot(statusCode, WEBSITE_URL, humanReadableStatusDuration, GMAIL_USERNAME);
  },
};

function takeAndSendScreenShot(statusCode, WEBSITE_URL, humanReadableStatusDuration, GMAIL_USERNAME) {
  const captureWebsite = require("capture-website");

  (async () => {
    filename = "screenshot" + Date.now() + ".png";
    await captureWebsite.file(WEBSITE_URL, filename);
    sendScreenshot(statusCode, filename, humanReadableStatusDuration, GMAIL_USERNAME);
  })();
}

function sendScreenshot(statusCode, filename, humanReadableStatusDuration, GMAIL_USERNAME) {
  attachment = [
    {
      filename: "website-screenshot.png",
      path: filename,
    },
  ];
  var emailHandler = require("./email");
  emailHandler.sendEmail(
      GMAIL_USERNAME,
      `web status: ${statusCode}`,
    `web status: ${statusCode}, status time: ${humanReadableStatusDuration}`,
    attachment
  );
}
