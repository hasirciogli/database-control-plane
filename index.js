const express = require('express')
const serversRouter = require("./namespaces/database-servers")
var crypto = require('crypto');

const app = express()
const port = 3000

const authKeys = {
    authKey: "admin1234",
    salt: "god-damn-1234",
    hashes: [
        "moon",
        "sun",
        "shit"
    ]
}

app.use(express.json());

app.use((req, res, next) => {
    var hash = crypto.createHash('sha256');


    var requestedHash = req.headers["x-auth-key"] ?? null;
    if (!requestedHash) {
        return res.status(401).json({
            status: false,
            message: "Authentication required."
        })
    }

    var hashBase = authKeys.authKey + authKeys.hashes.join("");
    hashBase = hash.update(hashBase);
    hashBase = hash.digest(hashBase).toString("base64");
    // Burada hash calculate edildi

    if (hashBase !== requestedHash) {
        return res.status(401).json({
            status: false,
            message: "Authentication required."
        })
    }

    next();
})


app.get("/health-check", (req, res) => {
    res.json({
        status: true,
        message: "Software running",
        time: Date.now().toLocaleString("tr-TR")
    })
})

app.use("/database-servers", serversRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})