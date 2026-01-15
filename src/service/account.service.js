const { User, Account, sequelize } = require("../database/models");

class AccountService {
  /**
   *
   */
  static async createAccount(payload) {
    try {
      const user = await User.findByPk(payload.id);

      if (!user) {
        const e = new Error("Invalid user");
        e.statusCode = 401;
        throw e;
      }
      if (user.status === "suspended") {
        const e = new Error("Please talk to an admin to create account");
        e.statusCode = 403;
        throw e;
      }
      const account = await user.createAccount({
        balance: 0,
        currency: payload.currency ?? "ngn",
        status: "active",
      });

      return { account, user };
    } catch (e) {
      throw e;
    }
  }

  static async getAccounts(id) {
    const user = await User.findByPk(id, {
      include: {
        model: Account,
        attributes: { include: ["balance", "currency", "status"] },
      },
    });
    if (!user) {
      const e = new Error("Invalid User");
      e.statusCode = 401;
      throw e;
    }
    return { accounts: user.Accounts, user };
  }

  static async getAccountById(payload) {
    const user = await User.findByPk(payload.id);
    if (!user) {
      const e = new Error("Invalid User");
      e.statusCode = 401;
      throw e;
    }

    const account = await Account.findOne(payload.accountId, {
      where: { id: payload.accountId, user_id: payload.id },
      attributes: ["balance", "currency", "status"],
    });

    if (!account) {
      const e = new Error("Account not found");
      e.statusCode = 404;
      throw e;
    }

    return { account, user };
  }

 static async closeAccount({ id, accountId }) {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(id, { transaction });
    if (!user) {
      const e = new Error('Invalid User');
      e.statusCode = 401;
      throw e;
    }

    const account = await Account.findOne({
      where: {
        id: accountId,
        user_id: id
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!account) {
      const e = new Error('Account not found');
      e.statusCode = 404;
      throw e;
    }

    if (account.status === 'closed') {
      const e = new Error('Account already closed');
      e.statusCode = 400;
      throw e;
    }

    if (Number(account.balance) !== 0) {
      const e = new Error('Account balance must be zero to close account');
      e.statusCode = 400;
      throw e;
    }

    await account.update(
      { status: 'closed' },
      { transaction }
    );

    await transaction.commit();
    return { account, user };

  } catch (e) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw e;
  }
}

}

module.exports = AccountService;
