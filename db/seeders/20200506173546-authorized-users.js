'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('AuthorizedUsers', [
      {
        uuid: '8f5a6be3-a464-40ea-A032-ac228b1c1dc7',
        nickname: 'test',
        refreshToken: '',
        token: '',
        salt: '',
        password: '098f6bcd4621d373cade4e832627b4f6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'b1eb1f90-e330-4a10-9a65-5d2a61886d51',
        nickname: 'suka blyat',
        refreshToken: '',
        token: '',
        salt: '',
        password: '1937f167ce4a58749368ca8e815336da',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AuthorizedUsers', null, {});
  }
};
