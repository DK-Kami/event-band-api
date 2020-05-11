'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizators', [
      {
        uuid: '7f87847a-2eac-43fe-A119-cd9a3ac9fd51',
        status: 1,
        UserId: 1,
        OrgId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        uuid: 'fda8989c-c7eb-4550-a733-d55d91a407d8',
        status: 1,
        UserId: 2,
        OrgId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '7b1e53fa-8b5d-4948-9741-334ed17df1ec',
        status: 0,
        UserId: 2,
        OrgId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '37d02639-853f-4995-9021-3410612cde2c',
        status: 1,
        UserId: 2,
        OrgId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        uuid: 'c56bdd3d-1ebd-4e88-ac1a-b6fd20e1039b',
        status: 1,
        UserId: 3,
        OrgId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Organizators', null, {});
  }
};
