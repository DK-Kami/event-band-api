'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('AuthorizedUsers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING,
        // unique: true,
      },
      token: {
        type: Sequelize.STRING,
        // unique: true,
      },
      salt: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        // onDelete: 'CASCADE',
        // references: {
        //   model: 'Users',
        //   key: 'id',
        //   as: 'userId',
        // }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('AuthorizedUsers');
  },
};