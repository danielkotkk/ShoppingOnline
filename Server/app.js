global.config = require("./config.json");
require("./data-access-layer/dal");
const express = require("express");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const beforeAuthController = require("./controllers/before-auth-controller");
const shoppingOnlineController = require("./controllers/shopping-online-controller");
const authController = require("./controllers/auth-controller");
const imageController = require("./controllers/image-controller");
const server = express();
const fs = require("fs");
const socketIO = require("socket.io");
const verifyLoggedIn = require("./middleware/verify-logged-in");
const expressRateLimit = require("express-rate-limit");

if (!fs.existsSync("./products-pictures")) {
    fs.mkdirSync("./products-pictures");
}
if (!fs.existsSync("./all-receipts")) {
    fs.mkdirSync("./all-receipts");
}


server.use(session({
    name: "ShoppingOnlineSession", // Name of the Cookie
    secret: "BestShopping", // Encryption key for the session id
    resave: true, // Start counting session time on each request.
    saveUninitialized: false // Don't create session automatically.
}));
server.use(express.json());
server.use(fileUpload());
server.use(cors());
server.use("/api/", expressRateLimit({
    windowMs: 3000, 
    max: 50, // Limit each IP to 50 request per windowMs
    message: "Too much requests, Please slow down."
}));
server.use("/api/before-auth", beforeAuthController);
server.use("/api/shopping-online", verifyLoggedIn, shoppingOnlineController);
server.use("/api/auth", authController);
server.use("/api/image", imageController)
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const listener = server.listen(3000, () => console.log("Listening on http://localhost:3000"));
global.socketServer = socketIO(listener);
server.io = socketServer;

socketServer.sockets.on("connection", socket => {
    console.log("Client has been connected");
    socket.on("disconnect", () => {
        console.log("Client has been disconnected");
    })

})