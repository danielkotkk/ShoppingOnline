const fs = require("fs");

function write(fileName, fileContent) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, fileContent, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}


function append(fileName, fileContent) {
    return new Promise((resolve, reject) => {
        fs.appendFile(fileName, fileContent, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

function read(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, "utf-8", (err, fileContent) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(fileContent);
        })
    })
}

module.exports = {
    write,
    append,
    read
}