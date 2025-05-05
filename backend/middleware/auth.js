const jwt = require("jsonwebtoken");
const config = require("../config/config");


module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "Invalid token." });
    }

    try {
        const playload = jwt.verify(token, config.jwtKey);
        req.user = playload;
        next();
    } catch {
        res.status(400).send("Invalid token.")
    }
}