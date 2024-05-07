const express = require("express")
const database = require("./../lib/Database.js");
const { randomUUID } = require("crypto");
const { message } = require("statuses");
var mysql = require('mysql2');
const { listAccounts } = require("../utils/database.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: true,
        servers: database.data.servers ?? []
    })
})

var check = (servers, newId) => {
    var founded = servers.filter((server) => {
        if (server.id == newId) {
            return true
        }
    })
    return founded === true ? true : false;
}

router.post("/", (req, res) => {
    if (!database.data.servers)
        database.data.servers = []
    var sid = "";

    do {
        console.log("gen x")
        sid = randomUUID();
    } while (check(database.data.servers, sid))

    database.data.servers.push({
        id: sid,
        endpoint: req.body.endpoint,
        port: req.body.port,
        user: req.body.user,
        pass: req.body.pass,
    })

    res.json({
        status: true
    })
})


router.get("/:serverId", (req, res) => {

    var server = database.data.servers.filter((server) => {
        if (server.id == req.params.serverId) {
            return server;
        }
    })

    if (server.length <= 0)
        return res.json({
            status: false,
            message: "Server not found."
        })

    return res.json({
        status: true,
        server: server.at(0)
    })
})

router.delete("/:serverId", (req, res) => {

    var servers = database.data.servers.filter((server) => {
        if (server.id != req.params.serverId) {
            return server;
        }
    })

    database.data.servers = servers;

    return res.json({
        status: true,
    })
})

router.put("/:serverId", (req, res) => {
    database.data.servers = database.data.servers.map((server) => {
        if (server.id == req.params.serverId) {
            return {
                id: server.id,
                ...req.body.data
            };
        } else return server
    })

    res.json({
        status: true
    })
})







// Accounts state
router.get("/:serverId/accounts", async (req, res) => {
    var server = database.data.servers.filter((server) => {
        if (server.id == req.params.serverId) {
            return server;
        }
    })

    if (server.length <= 0)
        return res.json({
            status: false,
            message: "Server not found."
        })

    server = server.at(0)


    var con = mysql.createConnection({
        host: server.endpoint,
        port: server.port,
        user: server.user,
        connectTimeout: 3000,
        password: server.pass
    });

    try {
        var isConnected = await (new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    return no()
                };

                let sql = `SELECT User as user, Host as host FROM mysql.user`;

                con.query(sql, (err, res, fields) => {
                    if (err) {
                        console.log("error: ", err);
                        no();
                        return;
                    }

                    console.log("users: ", res);
                    yes(res);
                });
            });
        }))

    } catch (error) {
    }

    if (!isConnected)
        return res.json({
            status: false,
            message: "Connection Error",
        })

    return res.json({
        status: true,
        accounts: isConnected,
    })
})

router.post("/:serverId/accounts", async (req, res) => {
    var server = database.data.servers.filter((server) => {
        if (server.id == req.params.serverId) {
            return server;
        }
    })

    if (server.length > 0)
        return res.json({
            status: false,
            message: "Account allready exits"
        })

    server = server.at(0)


    var accounts = await listAccounts({
        host: server.endpoint,
        port: server.port,
        user: server.user,
        pass: server.pass
    });

    if (accounts) {
        var exits = accounts.filter((acc) => {
            if (acc.user == req.body.user && acc.host == req.body.host)
                return true;
        })
        if (exits.length > 0)
            return res.json({
                status: false,
                message: "Account allready exits."
            })
    }

    return res.json({
        status: false,
        message: "Invalid error."
    })
})

router.get("/:serverId/health-check", async (req, res) => {

    var server = database.data.servers.filter((server) => {
        if (server.id == req.params.serverId) {
            return server;
        }
    })

    if (server.length <= 0)
        return res.json({
            status: false,
            message: "Server not found."
        })

    server = server.at(0)


    var con = mysql.createConnection({
        host: server.endpoint,
        port: server.port,
        user: server.user,
        connectTimeout: 3000,
        password: server.pass
    });

    try {
        var isConnected = await (new Promise((yes, no) => {
            con.connect(function (err) {
                if (err) {
                    return no()
                };
                yes(true)
            });
        }))

    } catch (error) {
    }



    return res.json({
        status: true,
        health: isConnected ? "Running" : "Down"
    })
})



module.exports = router