module.exports = class Server{
    constructor() {
        this.express = require('express');
        this.app = express();
    }
    run() {
        this.app.get('/', function (req, res) {
            res.send('hello world')
          })
    }
}
