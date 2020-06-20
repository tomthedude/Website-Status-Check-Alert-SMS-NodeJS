module.exports = class Logger {
  constructor(logName) {
    this.initLogName(logName);
    this.url = logName;
    const winston = require("winston");
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: this.logName },
      transports: [
        new winston.transports.File({
          filename: `logs/script-log-${this.logName}.log`,
          level: "script-error",
        }),
        new winston.transports.File({
          filename: `logs/script-log-${this.logName}.log`,
          level: "script-info",
        }),
        new winston.transports.File({
          filename: `logs/response-code-status-log-${this.logName}.log`,
        }),
        new winston.transports.Console(),
      ],
    });
    this.logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
    return this;
  }
  log(object) {
    this.logger.log(object);
  }

  initLogName(logName) {
    this.logName = logName.replace(/[\\/:"*?<>|]+/, "");
  }

  logScriptError(error) {
    if (typeof error == "object") {
      error.url = this.url;
    } else {
      error += `url: ${this.url}`;
    }

    var text = this.getJSONOrText(error);
    this.logger.log({
      level: "script-error",
      message: text,
    });
    console.log(`logged script error ${this.url}, ${text}`);
  }

  logScriptInfo(info) {
    if (typeof info == "object") {
      info.url = this.url;
    } else {
      info += `url: ${this.url}`;
    }
    var text = this.getJSONOrText(info);
    this.logger.log({
      level: "script-info",
      message: text,
    });
    console.log(`logged script info ${this.url}`);
  }

  mailSentFailureLog(error) {
    var wrapped = {
      status: "falied",
      action: "send-email",
      message: error,
    };
    this.logScriptError(wrapped);
  }

  mailSentSuccessLog(msg) {
    var wrapped = {
      status: "success",
      action: "send-email",
      errorObject: msg,
    };
    this.logScriptInfo(wrapped);
  }

  getJSONOrText(error) {
    var jsoned = "";
    try {
      jsoned = JSON.stringify(error);
    } catch {
      jsoned = JSON.stringify({
        someErrorOccured:
          "could not stringify object, some error occured with script",
      });
    }
    return jsoned;
  }
};
