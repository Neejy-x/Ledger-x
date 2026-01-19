const { User, Account, Audit_log} = require("../database/models");
const a = require("../database/models/audit_log");

exports.getUsers = async ({ limit, page }) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await User.findAndCountAll({
    where: { role: "user" },
    limit,
    offset,
    attributes: ["id", "first_name", "last_name", "email"],
    include: [
      {
        model: Account,
        attributes: ["id", "balance"],
      },
    ],
  });

  const users = rows.map((r) => ({
    ...r.toJSON(),
    totalAccount: r.accounts.length || [],
  }));
  return { users, count };
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

exports.getUserById = async (userId) => {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ["id", "email", "first_name", "last_name"],
    include: [
      {
        model: Account,
        attributes: ["id", "balance"],
      },
    ],
  });

  if (!user) {
    const e = new Error("user not found");
    e.statusCode = 404;
    throw e;
  }

  const result = {
    ...user.toJSON(),
    totalAccount: user.accounts.length,
  };
  return result;
};

exports.getAccounts = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const { rows, count } = await Account.findAndCountAll({
    limit,
    offset,
    attributes: ["id", "balance", "user_id"],
    order: [["createdAt", "DESC"]],
  });

  return { rows, count };
};


exports.getLogs = async ({page, limit}) => {
    const offset = (page - 1) * limit
    const {rows, count} = await Audit_log.findAndCountAll({
        limit,
        offset,
        attributes: { exclude: ['updatedAt']},
        order: [['createdAt', 'DESC']]
    })

    return {rows, count}
}