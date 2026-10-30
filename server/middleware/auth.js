const jwt = require("jsonwebtoken")


const auth = (req, res, next) => {
    const authorization = req.get("Authorization")
    const bearerToken = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null
    const token = req.cookies?.token || bearerToken

    if (!token) {
        return res.status(401).json({ message: "please login to access" })
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({ message: "invalid token" })
    }
}

module.exports = auth;