const AccountService = require('../service/account.service')

exports.createAccountHandler = async (req, res) => {
    const { id } = req.user
    const {currency} = req.body

    const payload  = {id, currency}
    

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

exports.getAccountsHandler = async (req, res) => {
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

exports.getAccountByIdHandler = async(req, res) => {
    const {accountId} = req.params
    const {id} = req.user

    const {account, user } = await AccountService.getAccountById({id, accountId})
    res.status(200).json({
        status: 'Successful',
        Owner: {
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

exports.closeAccountHandler = async(req, res) => {
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

