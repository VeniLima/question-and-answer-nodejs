const Sequelize = require('sequelize');

const connection = new Sequelize('q&a', 'root', 'DBA123', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;