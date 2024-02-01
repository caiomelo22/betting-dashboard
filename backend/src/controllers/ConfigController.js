const { FinancialAction } = require('../models/FinancialAction');

const Config = require('../models/Config').Config;

const update_deposited_value = async (req, res) => {
    try {
        const { deposited } = req.body

        const findConfig = await Config.findOne({ where: { key: 'deposited' } })

        if (findConfig.value > deposited) {
            await FinancialAction.create({
                value: findConfig.value - deposited,
                actionType: 'Withdraw'
            })
        } else if (deposited > findConfig.value) {
            await FinancialAction.create({
                value: deposited - findConfig.value,
                actionType: 'Deposit'
            })
        }

        await findConfig.update({ value: deposited });

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ data: 'An error has occured', error })
    }
};

module.exports = {
    update_deposited_value
}