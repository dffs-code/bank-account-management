'use strict';
const { Model, DataTypes } = require('sequelize');
class Transfers extends Model {
  static init(sequelize) {

    super.init({
      sender: DataTypes.INTEGER,
      receiver: DataTypes.INTEGER,
      value: DataTypes.DOUBLE
    }, {
      sequelize,
      modelName: 'Transfers',
    });
  }
  static associate(models) {
    // define association here
    this.belongsTo(models.Accounts, { foreignKey: 'sender', as: 'sender_account' });
    this.belongsTo(models.Accounts, { foreignKey: 'receiver', as: 'receiver_account' });
  }
}
module.exports = Transfers;