'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Events', [
      {
        uuid: '7595d0f1-9836-4c9f-8002-5e310eed883d',
        name: 'Anime party',
        description: 'ANIME!!! Ha-ha niBBa, u gay',
        datetimeFrom: '2020-05-09',
        datetimeTo: '2020-05-12',
        coords: '55.7522200, 37.5155600',
        OrganizationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '13c2db04-6375-47bc-a878-7a397ba4f3bd',
        name: 'Anime party 2.0',
        description: 'ANIME RETURN!!!',
        datetimeFrom: '2020-05-12',
        datetimeTo: '2020-05-15',
        coords: '55.7522200, 37.5155600',
        OrganizationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '300921b1-4ae3-442d-8396-642cde5e565b',
        name: 'MoscowJS 47',
        description: 'MoscowJS return! MoscowJS 47',
        datetimeFrom: '2020-05-10',
        datetimeTo: '2020-05-10',
        coords: '55.7522200, 37.5155600',
        OrganizationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '2529bdad-5501-43a3-852b-bba563592d2f',
        name: 'MoscowJS 48',
        description: 'MoscowJS return! MoscowJS 48',
        datetimeFrom: '2020-06-05',
        datetimeTo: '2020-06-05',
        coords: '55.7522200, 37.5155600',
        OrganizationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'e9c976b2-a77c-442A-8ffd-ff2a3ff4ee6a',
        name: 'Rock battle event',
        description: 'huila here',
        datetimeFrom: '2020-05-05',
        datetimeTo: '2020-05-20',
        coords: '55.7522200, 37.5155600',
        OrganizationId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', null, {});
  }
};
