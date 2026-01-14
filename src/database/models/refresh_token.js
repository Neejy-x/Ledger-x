'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refresh_token extends Model {
    async validateToken(token){
      return await bcrypt.compare(token, this.token)
    }
    static associate(models) {
      // define association here
      Refresh_token.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  }
  Refresh_token.init({
   token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    modelName: 'Refresh_token',
    hooks: {
      beforeSave: async(refreshToken)=> {
        if(refreshToken.changed('token')){
          refreshToken.token = await bcrypt.hash(refreshToken.token, 12)
        }
      }
    }
  });
  return Refresh_token;
};