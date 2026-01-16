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
       id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
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
        type: DataTypes.ENUM('pending', 'in_progress', 'committed', 'reversed'),
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
    hooks: {
      afterCreate: async(transaction, options)=>{
        if(!options.audit) return
        const {Audit_log} = transaction.sequelize.models

        await Audit_log.create({
          actorId: options.audit.userId,
          action: 'TRANSACTION_CREATED',
          metadata: {
            transactionId: transaction.id,
            status: transaction.status,
            amount: transaction.amount,
            sourceAccount: transaction.source_account_id,
            destinationAccountId: transaction.destination_account_id
          }
        }, {
          transaction: options.transaction
        })
      },
      afterUpdate: async(transaction, options)=> {
        if(!options.audit) return
        if(transaction.changed('status')){
          const {Audit_log} = transaction.sequelize.models
          await Audit_log.create({
            actorId: options.audit.userId,
            action: 'TRANSACTION_STATUS_CHANGED',
            metadata: {
              transactionId: transaction.id,
              newStatus: transaction.status
            }
          }, {
            transaction: options.transaction
          })
        }
      }
    }
  });
  return Transaction;
};