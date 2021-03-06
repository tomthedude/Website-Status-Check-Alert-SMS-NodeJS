module.exports =  class MySql{
    constructor(host, user, password, database) {
        this.isConnected = false;
        var mysql = require('mysql');

        this.sqlCon = mysql.createConnection({
          host: host,
          user: user,
          password: password,
          database: database
        });
        
        this.sqlCon.connect((err) => {
          if (err) throw err;
          // start sql logging flag
            this.isConnected = true;
            console.log("Connected To SQL!");
        });
    }

    runQuery(sqlQurey) {
        if (!this.isConnected) {
            return;
        }
        console.log("mysql query: " + sqlQurey);
        this.sqlCon.query(sqlQurey, function (err, result) {
          if (err) throw err;
          console.log("Mysql Result: " + result);
        });
    }

    insertNewResult(webCheckObject) {
        var sql = `INSERT INTO status_logs VALUES(NULL, "${webCheckObject.url}", NULL, "${webCheckObject.statusCode}", "${webCheckObject.humanReadableStatusDuration}", "${webCheckObject.responseTime}", "${webCheckObject.avgResponseTime}", ${webCheckObject.isCached});`;
        this.runQuery(sql);
    }

}
