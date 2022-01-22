const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Account = require('../models/account');
const Transfer = require('../models/transfer');

const connection = new Sequelize(dbConfig);

Account.init(connection);
Transfer.init(connection);

Account.associate(connection.models);
Transfer.associate(connection.models);

module.exports = connection;