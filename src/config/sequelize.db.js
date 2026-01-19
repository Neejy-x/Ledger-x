const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB,          // Database Name
  process.env.DB_USERNAME,    
  process.env.DB_PASSWORD,    // Password
  {
    host: process.env.DB_HOST,       
    dialect: 'postgres',     
    logging: false,          
  }
);

module.exports = sequelize;