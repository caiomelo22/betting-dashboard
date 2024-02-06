const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1w' })
}

const generateLoginTokens = (user) => {
    const accessToken = generateAccessToken({email: user.email})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })

    return {accessToken, refreshToken}
}

module.exports = {
    generateAccessToken,
    generateLoginTokens
}