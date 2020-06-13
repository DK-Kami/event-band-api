'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Events', [
      /**
       * Fregalo
      */
      {
        uuid: '7595d0f1-9836-4c9f-8002-5e310eed883d',
        name: 'Anime party',
        description: 'ANIME!!! Ha-ha welvome to us',
        datetimeFrom: '2020-05-30',
        datetimeTo: '2020-06-12',
        coords: '55.7822200, 37.5255600',
        OrganizationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '13c2db04-6375-47bc-a878-7a397ba4f3bd',
        name: 'Anime party 2.0',
        description: 'ANIME RETURN!!!',
        datetimeFrom: '2020-06-12',
        datetimeTo: '2020-06-15',
        coords: '55.7522200, 37.5155600',
        OrganizationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      /**
       * Tatar
       */
      {
        uuid: '300921b1-4ae3-442d-8396-642cde5e565b',
        name: 'MoscowJS 47',
        description: 'MoscowJS return! MoscowJS 47',
        datetimeFrom: '2020-05-20',
        datetimeTo: '2020-05-30',
        coords: '55.5522200, 37.5155600',
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
        coords: '55.7522200, 37.5355600',
        OrganizationId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      /**
       * Rock Battle
       */
      {
        uuid: 'e9c976b2-a77c-442A-8ffd-ff2a3ff4ee6a',
        name: 'Rock battle event',
        description: 'Rock battle here',
        datetimeFrom: '2020-06-01',
        datetimeTo: '2020-06-15',
        coords: '55.7822200, 37.5855600',
        OrganizationId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      /**
       * VDOOH
       */
      {
        uuid: 'eaf2261d-a885-4c50-b0f7-36aadda12478',
        name: 'VDOOH Party № 1',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '09.06.2020',
        datetimeTo: '09.06.2020',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'c27ce1cd-8afd-43fb-9932-dbe830f452dd',
        name: 'VDOOH Party № 2',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '12.06.2020',
        datetimeTo: '12.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '6c884980-23cf-4150-aec1-a9bf89be5f78',
        name: 'VDOOH Party № 3',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '15.06.2020',
        datetimeTo: '15.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '80ea8dcb-4e92-4aee-9181-01c70e5c0f96',
        name: 'VDOOH Party № 4',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '18.06.2020',
        datetimeTo: '18.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '0961a533-7d80-4638-914d-29f4a77d6c04',
        name: 'VDOOH Party № 5',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '21.06.2020',
        datetimeTo: '21.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '6fe63fc4-3dcb-447c-ba59-644f7e3199ad',
        name: 'VDOOH Party № 6',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '24.06.2020',
        datetimeTo: '24.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '867c5dd7-c419-4948-919f-0699eaed9eea',
        name: 'VDOOH Party № 7',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '27.06.2020',
        datetimeTo: '27.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'dcfbd026-b16e-496d-9895-b1303df5b9fe',
        name: 'VDOOH Party № 8',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '01.07.2020',
        datetimeTo: '01.07.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f21ab991-915a-440c-ae89-fce4fa4c70fc',
        name: 'VDOOH Party № 9',
        description: 'Our company organizes events of a new level',
        datetimeFrom: '04.06.2020',
        datetimeTo: '04.06.2020',
        coords: '55.8398707, 37.4902621',
        OrganizationId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', null, {});
  }
};
