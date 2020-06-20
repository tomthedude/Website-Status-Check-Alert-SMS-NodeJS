module.exports = class ResultsServer {
  run() {
    this.settings = require("../settings");
    var fs = require("fs"),
      http = require("http");

    http
      .createServer((req, res) => {
        var folder = this.settings.FRON_END_FOLDER;
        var formattedPage = req.url;
        if (
          req.url.includes(".json") &&
          req.url.toLowerCase().indexOf("?") === -1
        ) {
          folder = this.settings.RESULTS_FOLDER;
        } else if (req.url.toLowerCase().indexOf("?") > 0) {
          var formattedPage = req.url.substring(0, req.url.indexOf("?"));
        }
        fs.readFile(folder + formattedPage, function (err, data) {
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
