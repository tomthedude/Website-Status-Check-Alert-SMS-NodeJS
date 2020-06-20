module.exports = class EmailNotifier {
  constructor(logger = false) {
    this.settings = require("../settings");
    this.logger = logger;
  }
  isActive() {
    return this.settings.ALERT_EMAIL == "true";
  }
  sendEmail(email, subject, body, attchment = []) {
    if (!this.isActive()) {
      return;
    }
    var nodemailer = require("nodemailer");
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.settings.GMAIL_USERNAME,
        pass: this.settings.GMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: this.settings.GMAIL_USERNAME,
      to: email,
      subject: subject,
      html: body,
      attachments: attchment,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (!this.logger) {
        return;
      }
      if (error) {
        this.logger.mailSentFailureLog(error);
      } else {
        this.logger.mailSentSuccessLog(info.response);
      }
    });
  }
};
