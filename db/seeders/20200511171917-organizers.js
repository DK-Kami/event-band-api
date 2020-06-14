'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizers', [
      {
        uuid: '7f87847a-2eac-43fe-A119-cd9a3ac9fd51',
        status: 1,
        UserId: 1,
        OrganizationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        uuid: 'fda8989c-c7eb-4550-a733-d55d91a407d8',
        status: 1,
        UserId: 2,
        OrganizationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '7b1e53fa-8b5d-4948-9741-334ed17df1ec',
        status: 0,
        UserId: 2,
        OrganizationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '37d02639-853f-4995-9021-3410612cde2c',
        status: 1,
        UserId: 2,
        OrganizationId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'c56bdd3d-1ebd-4e88-ac1a-b6fd20e1039b',
        status: 1,
        UserId: 3,
        OrganizationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'b5c80f0b-44c9-4003-8fc0-f29778fdc491',
        status: 1,
        UserId: 2,
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '17f300fb-9097-45f7-8a10-f06df4726322',
        status: 1,
        UserId: 4,
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '71b102c6-d0f0-4221-a011-b4186f796937',
        status: 1,
        UserId: 2,
        OrganizationId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '451e0818-52fc-479e-8a2f-624b7893f40d',
        status: 1,
        UserId: 2,
        OrganizationId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Organizers', null, {});
  }
};
