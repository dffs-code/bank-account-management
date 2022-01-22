'use strict';
const { Model, DataTypes } = require('sequelize');

class Accounts extends Model {
  static init(sequelize){
    super.init({
      name: DataTypes.STRING,
      cpf: DataTypes.STRING,
      password: DataTypes.STRING,
      balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0
      },
    }, {
      sequelize,
    });
  }
  static associate(models) {
    // this.hasMany(models.transfers, { foreignKey: 'sender', as: 'sender'});
    // this.hasMany(models.transfers, { foreignKey: 'receiver', as: 'receiver'});
  }
}
module.exports = Accounts;