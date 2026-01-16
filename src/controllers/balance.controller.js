const checkBalance = require('../service/balance.service')

exports.getBalanceHandler = async (req, res) => {
    const{id} = req.user
    const {accountId} = req.params
    const balance = await checkBalance({accountId, id})

    res.status(200).json({
        status: 'Successful',
        balance
    })
}