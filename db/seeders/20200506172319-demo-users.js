'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        uuid: 'ef14ffc6-2dbb-400d-8b2b-9ed99cbba715',
        email: 'test@test.com',
        name: 'test',
        surname: 'surtest',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '7d1730f7-ca87-43c2-80af-fa70c9fa89ff',
        email: 'suka@blyat.com',
        name: 'suka',
        surname: 'blyat',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'e28b8a28-8d67-4c31-9b52-aa9741f392ac',
        email: 'js@js.com',
        name: 'js',
        surname: 'organizer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
