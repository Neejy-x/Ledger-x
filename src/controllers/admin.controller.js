const {
  updateUserRole,
  getUsers,
  updateUserStatus,
  getUserById,
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
