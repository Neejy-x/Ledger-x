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
        return {accounts: user.Accounts, user}
    }
}
