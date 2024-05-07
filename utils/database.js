var mysql = require('mysql2');

module.exports.listAccounts = async (db) => {
    const { host, port, user, pass } = db;
    var con = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass
    });

    try {
        var isConnected = await (new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no()
                };

                let sql = `SELECT User as user, Host as host FROM mysql.user`;

                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no();
                        return;
                    }

                    yes(res);
                });
            });
        }))

    } catch (error) {
    }

    return isConnected ? isConnected : null
}

module.exports.createAccount = async (db, nu) => {

    const { host, port, user, pass } = db;
    const { newUser, newHost, newPass } = nu

    var con = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass
    });

    try {
        var isConnected = await (new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no(null)
                };

                // Belirtilen bilgiler ile boş bir veritabanı kullanıcısı oluşturur
                let sql = `CREATE USER '${newUser}'.'${newHost} IDENTIFIED BY '${newPass}''`;

                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no(null);
                        return;
                    }

                    yes(res);
                });
            });
        }))

    } catch (error) {
    }

    return isConnected ? isConnected : null
}

module.exports.getAccountAssociatedDatabases = async (db, adu) => {
    const { host, port, user, pass } = db;
    const { checkUser, checkHost } = adu

    var con = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        connectTimeout: 3000,
        password: pass
    });

    try {
        var isConnected = await (new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    console.log("error: ", err);
                    return no(null)
                };

                // Belirtilen bilgiler ile boş bir veritabanı kullanıcısı oluşturur
                let sql = `SHOW GRANTS FOR '${checkUser}'.'${checkHost}'`;

                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no(null);
                        return;
                    }

                    yes(res);
                });
            });
        }))

    } catch (error) {
    }

    return isConnected ? isConnected : null
}