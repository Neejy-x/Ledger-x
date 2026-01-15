const AccountService = require('../service/account.service')

export const createAccountHandler = async (req, res) => {
    const { id } = req.user
    const {currency} = req.body

    const payload  = {id}
    if(currency) payload.currency = currency
    

    const {account, user} = await AccountService.createAccount(payload)
    res.status(200).json({
        status: 'Successful',
        details: {
            name: user.full_name,
            account: account.id,
            balance: account.balance,
            currency: account.currency
        }
    })
}

export const getAccounts = async (req, res) => {
    const {id} = req.user
    const {accounts, user} = await AccountService.getAccounts(id)
    res.status(200).json({
        status: 'Successful',
        user: {
            name: user.full_name,
            email: user.email
        },
        accounts: accounts.map(acc => ({
            id: acc.id,
            balance: acc.balance,
            currency: acc.currency
        })

        )
    })
}