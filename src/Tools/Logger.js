module.exports = class Logger {
  constructor(logName) {
    this.initLogName(logName);
    this.url = logName;
      const winston = require("winston");
    this.responseLogger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: this.logName },
      transports: [
        new winston.transports.File({
          filename: `logs/response-code-status-log-${this.logName}.log`,
        }),
        new winston.transports.Console(),
      ],
    });
    this.scriptLogger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: this.logName },
      transports: [
        new winston.transports.File({
            filename: `logs/script-log-${this.logName}.log`,
          }),
        new winston.transports.Console(),
      ],
    });
    this.responseLogger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
    this.scriptLogger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
    return this;
  }
  log(object) {
    this.responseLogger.log(object);
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
    this.scriptLogger.log({
      level: "error",
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
    this.scriptLogger.log({
      level: "info",
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
