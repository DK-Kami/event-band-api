'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Organizations', [
      {
        uuid: '989713f3-2f0b-4a14-b863-d98b5c00f94e',
        name: 'Fregalo',
        reputation: 9,
        description: `
          Normal fregal Sergeevich. Sounds honorable, looks stylish. Here, only fucked up in the head anime. Who are willing to sell their mother for ramen and a point for the opportunity to see waifa.
          If you're not like that, just walk through and leave us alone. We don't touch you, don't touch us. Trust me, you'll be better off. We're fucked up tight, we can fuck you in all the holes if you just mention anime in our presence.
        `,
        logo: 'fregalo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '2dabf617-911f-4da8-85ee-d1a03685ba82',
        name: 'Tatar',
        reputation: 7,
        description: `
          Eh brother, where are you in a hurry? Why are you in a hurry? Sit down and relax with us, shashlik-mashlyk and everything will be Chiki-puki, brother. Here all Ramzan, Azat, Regina, Kamil and leysan Utyasheva.
          Brother, we will not offend, come to us for a light
        `,
        logo: 'tatar.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '2d742eb2-cd96-47f2-a43c-d382ab46476d',
        name: 'Rock battle',
        reputation: 2,
        description: `
          Roooooooooooooooooooooooooooooock!!!!!!!
        `,
        logo: 'rock_battle.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '27b6d56d-53cd-4b41-b3c1-b76b13175ffc',
        name: 'VDOOH',
        reputation: 10,
        description: `Advertising network for running DOOH campaigns: Digital Outdoor and Indoor screens. Fast launch, flexible managing and media planning, budget control and online stats – all inside a single account`,
        logo: 'vdooh.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'acb8f6b5-c620-4ce4-a2f7-8c4c79b70cb4',
        name: 'Pocky',
        reputation: 10,
        description: 'Pocky sweets are the best in the world. And we know it. So we decided to create our own events in this mortal world',
        logo: 'pocky.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'a9c71312-3dd0-4bc8-b54b-7898031d69e9',
        name: 'Tetris',
        reputation: 9,
        description: 'Go to tetris battle',
        logo: 'tetris.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Organizations', null, {});
  }
};
