'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizations', [
      {
        uuid: '868d1201-2a4c-4686-9ed2-bd9335753693',
        name: 'Fregalo',
        reputation: 9,
        description: [
          'Normal fregal Sergeevich. Sounds honorable, looks stylish. Here, only fucked up in the head anime. Who are willing to sell their mother for ramen and a point for the opportunity to see waifa.',
          'If you\'re not like that, just walk through and leave us alone. We don\'t touch you, don\'t touch us. Trust me, you\'ll be better off. We\'re fucked up tight, we can fuck you in all the holes if you just mention anime in our presence.',
        ].join(' '),
        logo: 'fregalo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'c1112667-e704-493a-b2f0-4d27335db076',
        name: 'Tatar',
        reputation: 7,
        description: [
          'Eh brother, where are you in a hurry? Why are you in a hurry? Sit down and relax with us, shashlik-mashlyk and everything will be Chiki-puki, brother. Here all Ramzan, Azat, Regina, Kamil and leysan Utyasheva.',
          'Brother, we will not offend, come to us for a light',
        ].join(' '),
        logo: 'tatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f78e23bf-933c-4c87-b9a0-f3dc8c453757',
        name: 'Rock battle',
        reputation: 2,
        description: 'Roooooooooooooooooooooooooooooock!!!!!!!',
        logo: 'rock_battle.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '0084f28d-b41c-4e3f-a8ad-4551d4b2f767',
        name: 'VDOOH',
        reputation: 10,
        description: 'Advertising network for running DOOH campaigns: Digital Outdoor and Indoor screens. Fast launch, flexible managing and media planning, budget control and online stats – all inside a single account',
        logo: 'vdooh.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '7e554bd8-96fe-470b-8cba-3062798e77aa',
        name: 'Pocky',
        reputation: 10,
        description: 'Pocky sweets are the best in the world. And we know it. So we decided to create our own events in this mortal world',
        logo: 'pocky.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '75dbdd58-5da6-46b8-a747-a060fc23e22b',
        name: 'Tetris',
        reputation: 9,
        description: 'Go to tetris battle',
        logo: 'tetris.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Organizations', null, {});
  }
};
