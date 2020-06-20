module.exports = class FrontEndServer {
    run() {
      this.settings = require("../settings");
      var fs = require("fs"),
        http = require("http");
  
      http
        .createServer((req, res) => {
          fs.readFile(this.settings.FRON_END_FOLDER + req.url, function (err, data) {
            if (err) {
              res.writeHead(404);
              res.end(JSON.stringify(err));
              return;
            }
            res.writeHead(200);
            res.end(data);
          });
          console.log("front end server started");
        })
        .listen(8081);
    }
  };
  