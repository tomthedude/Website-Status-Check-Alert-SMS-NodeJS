// modules/email.js

module.exports = {
  sendEmail: function (email, subject, body, attchment = []) {
    var nodemailer = require("nodemailer");
    const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
    const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USERNAME,
        pass: GMAIL_PASSWORD,
      },
    });
    var mailOptions = {
      from: GMAIL_USERNAME,
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
  },
};
