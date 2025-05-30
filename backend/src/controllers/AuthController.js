const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs")
const { User } = require("../models/User")
const { generateAccessToken, generateLoginTokens } = require('../services/AuthService')
const express = require('express');
const { authenticate } = require('../middleware/Auth')

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        })
        if (!user) {
            return res.status(404).send("User not found.")
        }

        const result = await bcrypt.compare(password, user.password)

        if (!result) {
            return res.status(401).send("Password incorrect.")
        }

        const { accessToken, refreshToken } = generateLoginTokens({ email: user.email })

        await user.update({ refreshToken })

        return res.json({ accessToken, refreshToken })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.post('/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.body.token

        if (!refreshToken) return res.sendStatus(401)

        const user = await User.findOne({ where: { refreshToken } })

        if (!user) {
            return res.sendStatus(403)
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ email: user.email })
            return res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body

        const existingUser = await User.findOne({ where: {
            [Op.or]: [
                { username },
                { email }
            ]
        } })
        if (existingUser?.username == username) {
            return res.status(400).send("There is already an user with this username.")
        }
        else if (existingUser?.email == email) {
            return res.status(400).send("There is already an user with this email.")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ email, username, password: hashedPassword })

        const { accessToken, refreshToken } = generateLoginTokens({ email: user.email })

        await user.update({ refreshToken })

        return res.json({ accessToken, refreshToken })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.use(authenticate)

router.post('/logout', async (req, res) => {
    try {
        const { email } = req.user

        const user = await User.findOne({ where: { email } })

        await user.update({ refreshToken: null })

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

module.exports = router