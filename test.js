
var crypto = require('crypto');

const authKeys = {
    authKey: "admin1234",
    salt: "god-damn-1234",
    hashes: [
        "moon",
        "sun",
        "shit"
    ]
}
var hash = crypto.createHash('sha256');

var hashBase = authKeys.authKey + authKeys.hashes.join("");
hashBase = hash.update(hashBase);
hashBase = hash.digest(hashBase);

console.log(hashBase.toString("base64"))