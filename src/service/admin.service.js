const { User, Account } = require("../database/models");
const {Sequelize} = require('sequelize')

exports.getUsers = async () => {
  const users = await User.findAll({
    where: { role: "user" },
    attributes: [
        "id",
        "first_name",
        "last_name", 
        "full_name", 
        "email"
    ],
    include: [
      {
        model: Account,
        attributes: ["id", "balance"],
      },
    ],
    group: ['User.id', 'accounts.id']
  });

  return users.map( u => ({
    ...u.toJSON(),
    totalAccount: u.accounts.length
  }))
};

exports.updateUserRole = async ({ userId, role }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const e = new Error("User not found");
    e.statusCode = 404;
    throw e;
  }
  user.role = role;
  await user.save();
  return user;
};

exports.updateUserStatus = async ({ userId, status }) => {
  const user = user.findByPk(userId);
  if (!user) {
    const e = new Error("user not found");
    e.statusCode = 404;
    throw e;
  }

  user.status = status;
  await user.save();
  return user;
};


exports.getUserById = async(userId) => {
    const user = await User.findOne({
        where: {id: userId},
        attributes: ['id', 'email', 'first_name', 'last_name', 'full_name'],
        include: [
            {
                model: Account,
                attributes: ['id', 'balance']
            }
        ]
    })

    if(!user){
        const e = new Error('user not found')
        e.statusCode = 404
        throw e
    }

    const result = {
        ...user.toJSON(),
        totalAccount:user.accounts.length
    }

}