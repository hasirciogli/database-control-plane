const { fakerEN_US } = require("@faker-js/faker");
const database = require("./../lib/Database")
var crypto = require('crypto');

module.exports.calculateLocalHash = () => {
    var hash = crypto.createHash('sha256');

    const authKeys = database?.data?.authKeys ?? null;

    if (!authKeys) {
        clog("Auth key's are not initialized")
    }

    var hashBase = authKeys.authKey + authKeys.hashes.join("");
    hashBase = hash.update(hashBase);
    hashBase = hash.digest(hashBase).toString("base64");
    return hashBase
}

module.exports.checkLocalHash = () => {
    var hash = crypto.createHash('sha256');

    const authKeys = database?.data?.authKeys ?? null;

    if (!authKeys)
        return false

    return true
}

module.exports.generateLocalHash = () => {
    var hashes = [];

    for (let i = 0; i < crypto.randomInt(4, 12); i++) {
        hashes.push(fakerEN_US.person.firstName().toLowerCase() + fakerEN_US.person.lastName().toLowerCase())
    }

    database.data.authKeys = {
        authKey: crypto.randomUUID(),
        salt: fakerEN_US.internet.url(),
        hashes,
    }

    clog("Local hash generated")
}

module.exports.checkHashFromHeaders = (req) => {
    var requestedHash = req.headers["x-auth-key"] ?? null;

    return requestedHash ? this.calculateLocalHash() === requestedHash : false
}
