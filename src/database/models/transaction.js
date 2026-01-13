'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.hasMany(models.Ledger_entry,{
        foreignKey: 'transaction_id'
      })
    }
  }
  Transaction.init({
      source_account_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      destination_account_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'committed', 'reversed'),
        allowNull:false
      },
      idempotency_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};