const { 
    updateUserRole, 
    getUsers,
    updateUserStatus
 } = require("../service/admin.service")


exports.getUsersHandler = async (req, res) => {
    const users = await getUsers()
    res.status(200).json({
        status: 'Successful',
        users
    })
}


exports.updateUserRoleHandler = async (req, res) => {
    const {userId} = req.params
    const {role} = req.body
    const user = await updateUserRole({userId, role})
    res.status(200).json({
        status: 'Successful',
        user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role
        }
    })
}


exports.updateUserStatusHandler = async (req, res) => {
    const {userId} = req.params
    const {status} = req.body
    const user = await updateUserStatus({userId, status})
    res.status(200).json({
        status: 'Successful',
        user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            status: user.status
        }
    })
}