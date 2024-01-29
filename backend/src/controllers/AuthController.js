const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const {User} = require("../models/User")

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
}

const generateLoginTokens = (user) => {
    const accessToken = generateAccessToken({email: user.email})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' })

    return {accessToken, refreshToken}
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: {email}})
        if (!user)
        {
            return res.status(404).send("User not found.")
        }

        const result = await bcrypt.compare(password, user.password)

        if (!result)
        {
            return res.status(401).send("Password incorrect.")
        }

        const {accessToken, refreshToken} = generateLoginTokens({email: user.email})

        await user.update({refreshToken})

        return res.json({ accessToken, refreshToken })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.token

        if (!refreshToken) return res.sendStatus(401)

        const user = await User.findOne({where: {refreshToken}})

        if (!user)
        {
            return res.sendStatus(403)
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ email: user.email })
            return res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
}

const logout = async (req, res) => {
    try {
        const {email} = req.user

        const user = await User.findOne({where: {email}})

        await user.update({refreshToken: null})

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
}

const register = async (req, res) => {
    try {
        const {email, name, password} = req.body

        const existingUser = await User.findOne({where: {email}})
        if (existingUser)
        {
            return res.status(400).send("There is already an user with this email.")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({email, name, password: hashedPassword})

        const {accessToken, refreshToken} = generateLoginTokens({email: user.email})

        await user.update({refreshToken})

        return res.json({accessToken, refreshToken})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

module.exports = {
    login,
    refreshToken,
    logout,
    register
}