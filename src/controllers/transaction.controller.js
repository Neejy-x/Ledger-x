const {
  executeTransaction,
  getTransactions,
  getTransactionById,
} = require("../service/transactions.service");

exports.transactionHandler = async (req, res) => {
  const payload = req.body;
  const response = await executeTransaction(payload);
  res.status(200).json({
    status: "Successful",
    response,
  });
};

exports.getTransactionsHandler = async (req, res) => {
  const { id } = req.user;
  const page = parseInt(req.query.page )|| 1;
  const limit = parseInt(req.query.limit) || 10;

  payload = { id, page, limit };
  const { rows, count } = await getTransactions(payload);

  res.status(200).json({
    status: 'Successful',
    transactions: rows.map((r) => ({
      id: r.id,
      amount: r.amount,
      status: r.status,
      date: r.createdAt,
    })),
    meta: {
    totalPages: Math.ceil(count / limit) || 20,
    totalTransactions: count,
    page,
    limit
    }
  });
};

exports.getTransactionByIdHandler = async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await getTransactionById(transactionId);
  res.status(200).json({
    status: "Successful",
    transaction: {
        id: transaction.id,
        amount: transaction.amount,
        sender: transaction.source_account,
        receiver: transaction.destinations_account
    }

  });
};
