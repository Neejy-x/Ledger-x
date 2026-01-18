

const getUsersHandler = async (req, res) => {
    const users = await getUsers()
    res.status(200).json({
        status: 'Successful',
        users
    })
}