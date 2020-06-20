module.exports = class ResultsServer {
  run() {
    this.settings = require("../settings");
    var fs = require("fs"),
      http = require("http");

    http
      .createServer((req, res) => {
        fs.readFile(this.settings.RESULTS_FOLDER + req.url, function (err, data) {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          res.writeHead(200);
          res.end(data);
        });
        console.log("server started");
      })
      .listen(8080);
  }
};
