const jwt = require("jsonwebtoken");

// If there is no authorization header:
function isAdmin(request, response, next) {
    console.log(request.headers.authorization);
    if (!request.headers.authorization) {
        response.status(401).send("You are not an admin");
        return;
    }

    // User sends authorization header, take the token

    const splitTokens = request.headers.authorization.split(" ")[1];
    const token = splitTokens.split(",")[0];
    console.log(token);
    // If there is no token:
    if (!token) {
        response.status(401).send("You are not an admin");
    }

    // We have the token here - verify it:
    jwt.verify(token, config.jwt.adminSecretKey, (err, user) => {
        // If token expired or not legal
        if (err) {
            // If token expired:
            if (err.message === "jwt expired") {
                response.status(403).send("Your login session has expired");
                return;
            }
            // Token not legal:
            response.status(401).send("You are not an admin");
            return;
        }
        // Here the token is legal:
        next();
    });


}

module.exports = isAdmin;