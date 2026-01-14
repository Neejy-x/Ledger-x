'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn(
    'Users',
  'transaction_pin_attempts',
{
  type: Sequelize.INTEGER,
  allowNull: false,
  defaultValue: 0
})

  },

  async down (queryInterface, Sequelize) {
 
     await queryInterface.removeColumn('Users', 'transaction_pin_attempts');
     
  }
};
