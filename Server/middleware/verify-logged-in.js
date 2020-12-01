const jwt = require("jsonwebtoken");

// If there is no authorization header:
function verifyLoggedIn(request, response, next) {
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in");
        return;
    }

    // User sends authorization header - take the token
    const token = request.headers.authorization.split(" ")[1];

    // If there is no token:
    if (!token) {
        response.status(401).send("You are not logged in");
    }

    // We have the token here - verify it:
    jwt.verify(token, config.jwt.secretKey, (err, user) => {
        // If token expired or not legal
        if (err) {
            // If token expired:
            if (err.message === "jwt expired") {
                response.status(403).send("Your login session has expired");
                return;
            }
            // Token not legal:
            response.status(401).send({ "message": "You are not logged in" });
            return;
        }
        // Here the token is legal:
        next();
    });


}

module.exports = verifyLoggedIn;