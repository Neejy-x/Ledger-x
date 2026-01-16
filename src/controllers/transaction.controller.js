const executeTransaction = require('../service/transactions.service')

exports.transactionHandler = async (req, res) => {
    const payload = req.body
    const response = await executeTransaction(payload)
    res.status(200).json({
        status: 'Successful',
        response
    })
}