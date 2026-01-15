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

export const getAccountsHandler = async (req, res) => {
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
            currency: acc.currency,
            status: acc.status
        })

        )
    })
}

export const getAccountByIdHandler = async(req, res) => {
    const {accountId} = req.params
    const {id} = req.user

    const {account, user } = await AccountService.getAccountById({id, accountId})
    res.status(200).json({
        status: 'Successful',
        user: {
            name: user.full_name,
            email: user.email
        },
        account: {
            id: account.id,
            balance: account.balance,
            currency: account.currency,
            status: account.status
        }
    })
}

export const closeAccountHandler = async(req, res) => {
    const {accountId} = req.params
    const {id} = req.user

    const {account, user } = await AccountService.closeAccount({id, accountId})
    res.status(200).json({
    status: 'Successful',
    user: {
        name: user.full_name,
        email: user.email
    },
    closed_account: {
    accountId: account.id,
    status: account.status
    }
    })
}

