const executeTransaction = require('../service/transactions.service')

exports.transactionHandler = async (req, res) => {
    const payload = req.body
    const result = await executeTransaction(payload)
    
}