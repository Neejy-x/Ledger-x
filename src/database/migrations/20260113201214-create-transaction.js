'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      source_account_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      destination_account_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'committed', 'reversed'),
        allowNull:false
      },
      idempotency_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    await queryInterface.dropTable('Transactions');
  }
};