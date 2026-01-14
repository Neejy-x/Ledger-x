const {Account, User, Transaction, Ledger_entry, sequelize} = require('../database/models')
const {logger} = require('../middlewares/errorHandler')
const client = require('../redis/client')

const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000
async function executeTransaction({
    sourceAccountId,
    destinationAccountId,
    amount,
    idempotencyKey
}){

    const redisKey = `idempotency:${idempotencyKey}`
    const existing = await client.get(redisKey)

    if(existing){
        const parsed = JSON.parse(existing)
    }
    
    if(parsed.status === 'completed'){
       return parsed.result
    }

    if(parsed.result === 'in_progress'){
        throw new Error('transaction already initiated')
    }

    const lockset = await client.set(redisKey, JSON.stringify({status: 'in_progress'}), 'NX', 'EX', IDEMPOTENCY_TTL)

    if(!lockset) throw new Error('duplicate transaction detected')

    const transferTransaction = await sequelize.transaction()

    try{
    
    const sourceAccount = await Account.findByPk(sourceAccountId,{
        transaction: transferTransaction,
        lock: transferTransaction.LOCK.UPDATE
    })

    const destinationAccount = await Account.findByPk(destinationAccountId, {
        transaction: transferTransaction,
        lock: transferTransaction.LOCK.UPDATE
    })

    if(!sourceAccount || !destinationAccount) throw new Error('Account not found!')
    
    if(sourceAccount.status !== 'active') throw new Error('Please reach out to customer care rep for help')
    
    if(destinationAccount.status !== 'active') throw new Error('invalid destination account')
    
    

    }catch(e){
    
    }
}

startDB()