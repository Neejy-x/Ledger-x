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
    // check if account is active
    if(this.status === 'suspended'){
      throw new Error('Account suspended due to too many failed PIN attempts')
    }

    //validate pin
    const isValid =  await bcrypt.compare(pin, this.pin)
    if(!isValid){
      this.transaction_pin_attempts += 1

      if(this.transaction_pin_attempts >= 3){
        this.status = 'suspended'
      }

      await this.save({fields: ['transaction_pin_attempts', 'status']})

      return false
    }

    this.transaction_pin_attempts = 0
    await this.save({fields: ['transaction_pin_attempts']})
    return true
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
        },
        set(value){
          this.setDataValue('email', value.toLowerCase())
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
      transaction_pin_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
      attributes: {exclude: ['password', 'pin']}
    },
    scopes: {
      withSecret: {
        attributes: {include:['password', 'pin']}
      }
    }
  });
  return User;
};