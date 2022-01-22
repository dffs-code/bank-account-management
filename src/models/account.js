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
    this.hasMany(models.Transfers, { foreignKey: 'sender', as: 'sent_transfers'});
    this.hasMany(models.Transfers, { foreignKey: 'receiver', as: 'received_transfers'});
  }
}
module.exports = Accounts;