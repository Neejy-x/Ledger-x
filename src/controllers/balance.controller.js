const checkBalance = require('../service/balance.service')

export const getBalanceHandler = async (req, res) => {
    const{id} = req.user
    const {accountId} = req.params
    const balance = await checkBalance({accountId, id})

    res.status(200).json({
        status: 'Successful',
        balance
    })
}