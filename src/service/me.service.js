const {User, Account, Transaction} = require('../database//models')

class meService {
    static async me(id){
        const user = await User.findByPk(id, {
            attributes: { exclude : ['transaction_pin_attempt', 'password', 'pin', 'role', 'updatedAt']},
            include: [
                {
                    model: Account,
                    attributes: ['id', 'balance', 'createdAt', 'currency'],
                    order: [['createdAt', 'DESC']]
                }
            ]
        })
    }
}