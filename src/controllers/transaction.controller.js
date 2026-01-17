const {executeTransaction, getTransactions, getTransactionById} = require('../service/transactions.service')

exports.transactionHandler = async (req, res) => {
    const payload = req.body
    const response = await executeTransaction(payload)
    res.status(200).json({
        status: 'Successful',
        response
    })
}

exports.getTransactions = async (req, res) => {
    const { id } = req.user

    const transactions = await getTransactions(id)

    res.status(200).json({
        status: successful,
        transactions: transactions.map( t => ({
            id: t.id,
            amount: t.amount,
            status: t.status,
            date: t.createdAt
        }))
    })

}

exports.getTransactionByIdHandler = async (req, res) => {
    const {transactionId} = req.params
    const transaction = await getTransactionById(transactionId)
    res.send(200).json({
        status: 'Successful',
        
    })
}