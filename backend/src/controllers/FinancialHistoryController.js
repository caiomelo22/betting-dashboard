const { FinancialHistory } = require('../models/FinancialHistory');
const { User } = require('../models/User');
const express = require('express');

const router = express.Router();

router.put('/update', async (req, res) => {
    try {
        const { value } = req.body

        const user = await User.findOne({ where: { email: req.user.email } })
        const { totalDeposited } = user

        await FinancialHistory.create({
            value: Math.abs(value),
            userEmail: user.email,
            actionType: value < 0 ? 'Withdraw' : 'Deposit'
        })

        totalDeposited += value

        await user.update({ totalDeposited });

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
})

module.exports = router