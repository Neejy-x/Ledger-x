'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ledger_entries', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'id'
        }
      },
      transaction_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Transactions',
          key: 'id'
        }
      },
      delta: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: false
      },
      balance_after: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ledger_entries');
  }
};