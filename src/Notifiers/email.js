module.exports = class EmailNotifier {
    constructor() {
        this.settings = {
            GMAIL_USERNAME: process.env.GMAIL_USERNAME,
            GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
        };
    }
    sendEmail(email, subject, body, attchment = []) {
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
      
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
}
