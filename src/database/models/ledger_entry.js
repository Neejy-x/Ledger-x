'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ledger_entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ledger_entry.belongsTo(models.Account, {
        foreignKey: 'account_id'
      })

      Ledger_entry.belongsTo(models.Transaction,{
        foreignKey: 'transaction_id'
      })
    }
  }
  Ledger_entry.init({
     account_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      transaction_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      delta: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
      },
      balance_after: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
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
    modelName: 'Ledger_entry',
  });
  return Ledger_entry;
};