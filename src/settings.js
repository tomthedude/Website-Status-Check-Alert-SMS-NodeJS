const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    WEBSITE_URL: process.env.WEBSITE_URL,
    ALERT_SMS: process.env.ALERT_SMS,
    ALERT_EMAIL: process.env.ALERT_EMAIL,
    ALERT_EMAIL_SCREENSHOT: process.env.ALERT_EMAIL_SCREENSHOT,
    ALERT_TELEGRAM: process.env.ALERT_TELEGRAM,
    CHECK_INTERVAL_OK: parseInt(process.env.CHECK_INTERVAL_WHEN_OK),
    CHECK_INTERVAL_ERROR: parseInt(process.env.CHECK_INTERVAL_WHEN_ERROR),
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    SENDER_NUMBER: process.env.SENDER_NUMBER,
    NOTIFICATION_NUMBER: process.env.NOTIFICATION_NUMBER
  
  }
  