'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.User, {
        foreignKey: 'user_id'
      })

      Account.hasMany(models.Ledger_entry, {
        foreignKey: 'account_id'
      })
   
    }
  }
  Account.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      currency: {
        type: DataTypes.ENUM('usd','ngn','gbp'),
        allowNull: false,
        defaultValue: 'ngn'
      },
      balance: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('active','frozen'),
        allowNull: false,
        defaultValue: 'active'
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
    modelName: 'Account',
  });
  return Account;
};