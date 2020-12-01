const crypto = require("crypto");
const salt = "MakeThingsMess";

function hash(password) {
    return crypto.createHmac("sha512", salt).update(password).digest("hex");
}

module.exports = hash;