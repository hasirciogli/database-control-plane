require('./utils/log')
var crypto = require('crypto');
const express = require('express')
const serversRouter = require("./namespaces/database-servers")

const { generateLocalHash, checkLocalHash, checkHashFromHeaders } = require('./utils/hash');

const app = express()
const port = 3000

app.use(express.json());

app.use((req, res, next) => {

    if (!checkHashFromHeaders(req))
        return res.status(401).json({
            status: false,
            message: "Authentication required."
        })

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








// Mainside an app (Load save database and check hash, ... ETC.)
async function main() {
    await loadState();

    app.listen(port, () => {
        clog(`App started on ${port}`)
    })
}

async function loadState() {
    clog("Load starting");
    if (!checkLocalHash())
        generateLocalHash()
    clog("Load ended")
}

// Ana fonksiyonu çağırın
main();