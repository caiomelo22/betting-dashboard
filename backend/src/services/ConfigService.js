const Config = require('../models/Config').Config;

const getDepositedValue = async () => {
    const findConfig = await Config.findOne({ where: { key: 'deposited' } })

    return parseFloat(findConfig.value)
}

module.exports = {
    getDepositedValue
}