'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  async validatePassword (password){
    return await bcrypt.compare(password, this.password)
  }

  async validatePin(pin){
    return await bcrypt.compare(pin, this.pin)
  }

    static associate(models) {
      //define associations here
      User.hasMany(models.Account, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({

      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      full_name: {
        type: DataTypes.VIRTUAL,
        get(){
          return `${this.first_name} ${this.last_name}`
        }
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100]
        }
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
      status: {
        type: DataTypes.ENUM('active', 'suspended'),
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
    modelName: 'User',
    tableName: 'Users',
    hooks: {
      beforeSave: async (user) => {
        if(user.changed('password')){
          user.password = await bcrypt.hash(user.password, 12)
        }
        if(user.changed('pin')){
          user.pin = await bcrypt.hash(user.pin, 12)
        }
      }
    },
    defaultScope: {
      attributes: exclude['password', 'pin']
    },
    scopes: {
      withSecret: {
        attributes: include['password', 'pin']
      }
    }
  });
  return User;
};