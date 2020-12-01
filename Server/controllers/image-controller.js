const express = require("express");
const router = express();
const multer = require("multer");
const upload = multer();
const fs = require("fs");

router.post("/upload-image/:imageUuidName", upload.single("picture"), async function (request, response) {
    try {
        if (!request.files.picture) {
            response.status(400).send("No file sent");
            return;
        }
        const imageUuidName = request.params.imageUuidName;
        // Sent image
        const image = request.files.picture;
        image.name = imageUuidName;

        image.mv("./products-pictures/" + image.name);
        response.end();
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})

router.get("/get-one-image/:imageUUID", async (request, response) => {
    try {
        const path = require("path");
        const imageUUID = request.params.imageUUID;

        fs.readFile(path.join(__dirname, "../products-pictures/" + imageUUID), (err, file) => {
            return new Promise((resolve, reject) => {
                if (err)
                    reject(err);
                resolve(file);
            });
        })
        // Sends the image to the client
        response.sendFile(path.join(__dirname, "../products-pictures/" + imageUUID));
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
router.delete("/delete-image/:imageUuidName", async function (request, response) {
    try {
        const imageUuidName = request.params.imageUuidName;
        fs.unlink("./products-pictures/" + imageUuidName, err => {
            if (err)
                console.error(err);
        });
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
})
module.exports = router;