const {Sport} = require('../models/Sport');
const express = require('express');

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const sports = await Sport.findAll();

        return res.json(sports)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

router.post('/create', async (req, res) => {
    try {
        const {name} = req.body

        const sport = await Sport.create({name})

        return res.json(sport)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

module.exports = router