const { use } = require("react")
const { updateUserRole } = require("../service/admin.service")


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
            fullName: user.fullName,
            email: user.email,
            role: user.role
        }
    })
}