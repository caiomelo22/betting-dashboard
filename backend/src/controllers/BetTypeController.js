const {BetType} = require('../models/BetType');
const express = require('express');
const { authenticate, validateAdminPermission } = require('../middleware/Auth')

const router = express.Router();

router.use(authenticate)

router.get('/list', async (req, res) => {
    try {
        const betTypes = await BetType.findAll();

        return res.json(betTypes)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

router.post('/create', async (req, res) => {
    try {
        if (!validateAdminPermission(req.user.email)) {
            return res.sendStatus(403)
        }
        
        const {name} = req.body

        const betType = await BetType.create({name})

        return res.json(betType)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})

module.exports = router