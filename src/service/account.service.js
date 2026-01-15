const {User, Account, sequelize} = require('../database/models')

class AccountService {

    /** 
    *
    */
    static async createAccount(payload){
        try{
        
        const user = await User.findByPk(payload.userId)

        if(!user){
            const e = new Error('Invalid user')
            e.statusCode = 401
            throw e
        }
        if(user.status === 'suspended'){
            const e = new Error('Please talk to an admin to create account')
            e.statusCode = 403
            throw e
        }
        const account = await user.createAccount({
        balance: 0,
        currency: payload.currency ?? 'ngn',
        status: 'active'
        })

        return{account, user}
        }catch(e){
        throw e
        }
    }


    static async getAccounts(userId){
        const user = await User.findByPk(userId, {include: {model: Account, attributes: {include: ['balance', 'currency']}} })
        if(!user){
            const e = new Error('Invalid User')
            e.statusCode = 401
            throw e
        }

         if(user.status === 'suspended'){
            const e = new Error('Please talk to an admin to create account')
            e.statusCode = 403
            throw e
        }
        return {accounts: user.Accounts, user}
    }


    static async getAccountById(payload){
    const user = await User.findByPk(payload.userId)
    if(!user ){
        const e = new Error('Invalid User')
        e.statusCode = 401
        throw e
    }

     if(user.status === 'suspended'){
            const e = new Error('Please talk to an admin to create account')
            e.statusCode = 403
            throw e
        }

    const account = await Account.finByPk(payload.accountId, {include: ['balance', 'currency', 'status']})
    if(!account){
        const e = new Error('Account not found')
        e.statusCode = 404
        throw e
    }

    if(account.user_id !== payload.userId){
        const e = new Error('Unauthorized')
        e.statusCode = 403
        throw e
    }

    return {account, user}
    }
}

module.exports = AccountService
