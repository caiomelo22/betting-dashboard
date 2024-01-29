const jwt = require('jsonwebtoken')

let tokenBlacklist = {}

function cleanBlacklist() {
    tokenBlacklist = {}
}

function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader?.split(' ')[1]

    if (!token) return res.sendStatus(401)

    const currentRoute = req.path

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }

        if (tokenBlacklist.hasOwnProperty(user.email) && tokenBlacklist[user.email].includes(token)) {
            return res.sendStatus(403)
        }

        if (currentRoute.includes('/logout')) {
            if (!tokenBlacklist.hasOwnProperty(user.email)) {
                tokenBlacklist[user.email] = []
            }

            tokenBlacklist[user.email].push(token)
        }

        req.user = user
        next()
    })
}

module.exports = {
    authenticate,
    cleanBlacklist
}