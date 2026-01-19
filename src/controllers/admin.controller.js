const { getAccounts } = require("../service/account.service");
const {
  updateUserRole,
  getUsers,
  updateUserStatus,
  getUserById,
  getLogs,
} = require("../service/admin.service");

exports.getUsersHandler = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { users, count } = await getUsers({ limit, page });
  res.status(200).json({
    status: "Successful",
    users,
    meta: {
      totalPages: Math.ceil(count / limit),
      totalUsers: count,
      page,
      limit,
    },
  });
};

exports.getUserByIdHandler = async (req, res) => {
  const { userId } = req.params;

  const user = await getUserById(userId);

  res.status(200).toJSON({
    status: "Successful",
    user,
  });
};

exports.updateUserRoleHandler = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await updateUserRole({ userId, role });
  res.status(200).json({
    status: "Successful",
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.updateUserStatusHandler = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  const user = await updateUserStatus({ userId, status });
  res.status(200).json({
    status: "Successful",
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      status: user.status,
    },
  });
};

exports.getAccountsHandler = async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const {rows, count} = await getAccounts({page,limit})

    res.status(200).json({
        status: 'Successful',
        accounts: rows.map( row => ({
           id:  row.id,
           balance: row.balance,
           owner: row.user_id
        })),
        meta:{
            totalAccounts: count,
            page,
            count,
            totalPages: Math.ceil(count / limit)
        }
    })
}


exports.getLogsHandler =  async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10

    const {rows, count} = await getLogs({page, limit})

    res.status(200).json({
        status: 'Successful',
        logs: rows,
        metadata:{
            totalLogs: count,
            totalPages: Math.ceil(count / limit),
            page,
            limit
        }
    })
}