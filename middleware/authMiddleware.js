const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token or bad format." });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token Extracted:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;