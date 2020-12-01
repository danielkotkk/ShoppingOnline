const mongoose = require("mongoose");

function connectAsync() {
    return new Promise((resolve, reject) => {
        // String with all the connection info.
        const connStr = config.mongodb.connStr;
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        // Connect

        mongoose.connect(connStr, options, (err, database) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(database);
        })
    })
}

(async () => {
    try {
        const db = await connectAsync();
        console.log(`Connected to ${db.name}`)
    } catch (err) {
        console.error(err);
    }
})();