'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ChatUsers', {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ChatUsers');
  }
};