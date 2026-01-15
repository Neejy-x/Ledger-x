const {Account, User} = require('../database/models')
const client = require('../redis/client')

const BALANCE_CHECK_TTL = 60 * 60

const checkBalance = async({accountId, id})=> {
    const redisKey = `account:balance:${id}:${accountId}`
try{

const cachedBalance = await client.get(redisKey)
if(cachedBalance) return JSON.parse(cachedBalance)

const account = await Account.findOne(accountId, {
    where:
     {  id: accountId,
        user_id: user.id
    }})
if(!account) throw new Error('Account does not exist')

const result = {
    balance: account.balance,
    currency: account.currency,
    status: account.status
}

await client.set(redisKey, JSON.stringify(result), 'EX', BALANCE_CHECK_TTL)

return result;

}catch(e){
throw e; 
}

}

module.exports = checkBalance