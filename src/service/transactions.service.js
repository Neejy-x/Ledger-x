const { tr } = require('zod/locales')
const {Account, User, Transaction, Ledger_entry, sequelize} = require('../database/models')
const {logger} = require('../middlewares/error.middleware')
const client = require('../redis/client')

const IDEMPOTENCY_TTL = 24 * 60 * 60
exports.executeTransaction = async ({
    sourceAccountId,
    destinationAccountId,
    amount,
    idempotencyKey,
    transactionPin
})=> {

    const redisKey = `idempotency:${idempotencyKey}`
    const existing = await client.get(redisKey)
    let parsed;
    if(existing){
         parsed = JSON.parse(existing)
    }
    
    if(parsed?.status === 'completed'){
       return parsed.result
    }

    if(parsed?.status === 'in_progress'){
        throw new Error('transaction already initiated')
    }

    const lockset = await client.set(redisKey, JSON.stringify({status: 'in_progress'}), 'NX', 'EX', IDEMPOTENCY_TTL)

    if(!lockset) throw new Error('duplicate transaction detected')

    const transferTransaction = await sequelize.transaction()

    try{
     //validate source account transaction pin
    const user = await sourceAccount.getUser({transaction: transferTransaction})
    const validPin = user.validatePin(transactionPin)
    if(!validPin) throw new Error('invalid pin entered')

    
    //find and lock destination and source accounts
      const [sourceAccount, destinationAccount] = await Account.findAll({
      where: { id: [sourceAccountId, destinationAccountId] },
      order: [['id', 'ASC']],
      transaction: transferTransaction,
      lock: transferTransaction.LOCK.UPDATE
    })
   
    //validate both source and destination accounts
    if(!sourceAccount || !destinationAccount) throw new Error('Account not found!')
    
    if (sourceAccountId === destinationAccountId) {
    throw new Error('Cannot transfer to same account')
    }

    //validate both source and destination account statuses
    if(sourceAccount.status !== 'active') throw new Error('Please reach out to customer care rep for help')
    
    if(destinationAccount.status !== 'active') throw new Error('invalid destination account')

    //validate account currencies
    if(sourceAccount.currency !== destinationAccount.currency) throw new Error(`Invalid transaction type: can only transfer to ${sourceAccount.currency} account`)

    //validate source account balance
    if(Number(sourceAccount.balance) < Number(amount)) throw new Error('Insufficient balance')

    const transactionRecord = await Transaction.create({
        source_account_id: sourceAccountId,
        destination_account_id: destinationAccountId,
        amount,
        status: 'pending',
        idempotency_key: idempotencyKey
    }, {
        transaction: transferTransaction,
        audit: {userId: sourceAccount.user_id}
    })
    
    //instantiate updated account balances for both accounts
    const newSourceAccountBalance = Number(sourceAccount.balance) - Number(amount)
    const newDestinationAccountBalance = Number(destinationAccount.balance) + Number(amount)
    
    //update source Account balance
    await sourceAccount.update({balance: newSourceAccountBalance}, {transaction: transferTransaction})

    //update destination Account balance
    await destinationAccount.update({balance: newDestinationAccountBalance}, {transaction: transferTransaction})

    //create ledger entry for source account
    await sourceAccount.createLedger_entry({
        transaction_id: transactionRecord.id,
        delta: -Number(amount),
        balance_after: newSourceAccountBalance,
    }, {
        transaction: transferTransaction,
    })

    //create ledger entry for source account
    await destinationAccount.createLedger_entry({
        transaction_id: transactionRecord.id,
        delta: +Number(amount),
        balance_after: newDestinationAccountBalance
    }, {transaction: transferTransaction})

    //update transaction status
    await transactionRecord.update({status: 'committed'},
        {
            transaction: transferTransaction,
            audit: {userId: sourceAccount.user_id}
        }
    )

    const result = {
        transactionId: transactionRecord.id,
        status: 'committed'
    }

    //commit transaction
    await transferTransaction.commit()

    //update idempotency/transaction status
    await client.set(redisKey, JSON.stringify({status: 'completed', result}), 'EX', IDEMPOTENCY_TTL )

    //invalidate cached balances for both accounts
    await client.del(`account:balance:${sourceAccountId}`)
    await client.del(`account:balance:${destinationAccountId}`)
    return {result, amount: transactionRecord.amount, from: sourceAccount.full_name, to: destinationAccount.full_name}
    }catch(e){
    if(transferTransaction && !transferTransaction.finished){
    await transferTransaction.rollback()
    }
    await client.set(
    redisKey,
    JSON.stringify({ status: 'failed', error: e.message }),
    'EX',
    IDEMPOTENCY_TTL
    )
    throw e;
    }
}

exports.getTransactions = async (id)=>{

    const accounts = await Account.findAll({where: {user_id: id}, attributes: ['id']})
    const accountIds = accounts.map(ac => ac.id)
  
    return await Transaction.findAll({
        where: {
             [Op.or] : [
            {sourceAccountId: accountIds},
            {destinationAccountId: accountIds}
        ]
    }
    })

}


exports.getTransactionById = async (transactionId) => {
    const transaction = await Transaction.findByPk(transactionId)
    if(!transaction){
        const e = new Error('Transaction not found')
        e.statusCode = 404
        throw e
    }
    return transaction
}