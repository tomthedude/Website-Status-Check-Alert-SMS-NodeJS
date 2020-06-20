module.exports = class Logger {
  constructor(logName) {
    this.initLogName(logName);
    const winston = require("winston");
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      defaultMeta: { service: this.logName },
      transports: [
        new winston.transports.File({
          filename: `logs/script-error-${this.logName}.log`,
          level: "script-error",
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
    var text = this.getJSONOrText(error);
    this.logger.log({
      level: "script-error",
      message: text,
    });
    console.log(`logged script error ${error.url}`);
  }

  getJSONOrText(error) {
    var jsoned = "";
    try {
      jsoned = JSON.stringify(error);
    } catch {
      jsoned = "could not stringify object, some error";
    }
    return jsoned;
  }
};
