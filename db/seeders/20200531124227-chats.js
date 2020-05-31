'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Chats', [
      {
        uuid: '1df29884-bf9b-453b-8434-ddf3537d0b05',
        Event: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '40f934ca-35cb-4707-b3dd-c53c6c0538dc',
        Event: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '10b170d0-d174-48d2-9f52-730ff174b5e5',
        EventId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '741ada57-d6e9-48cf-a054-346c426e8e6c',
        EventId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '48953cd2-1547-4754-b43b-94fa584a63f3',
        EventId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    return queryInterface.bulkInsert('ChatMessages', [
      {
        uuid: '0a51af18-2627-4cf4-82c0-81971a767b59',
        ChatId: 1,
        UserId: 1,
        message: 'hi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'b67850d6-2740-4e48-80f9-a7fc66315d70',
        ChatId: 1,
        UserId: 1,
        message: 'how are u?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '1275028c-58b5-4527-8626-365fb9a37bbd',
        ChatId: 1,
        UserId: 2,
        message: 'hmmmm...',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'f674c5eb-5122-4080-b4cb-76fc95951780',
        ChatId: 1,
        UserId: 3,
        message: ')))',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '9d0034a5-c012-41ad-9d4a-5b614d360b36',
        ChatId: 2,
        UserId: 1,
        message: 'hi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '89c47673-5a56-4a9c-ae7f-45af6ae1e530',
        ChatId: 2,
        UserId: 1,
        message: 'how are u?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'a1acc33c-2b62-41f3-8da8-7ad38c955ad0',
        ChatId: 3,
        UserId: 2,
        message: 'yaaaaaaaaaa',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '06003d88-7b06-4f2d-9a45-ba8e2167eff2',
        ChatId: 3,
        UserId: 3,
        message: ')))',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        uuid: '5970ee89-f108-4927-b853-92f68cdf6364',
        ChatId: 4,
        UserId: 1,
        message: 'yooo boiii',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'ac4f8fd6-8bb2-4dcf-a9e7-bedbeec34489',
        ChatId: 4,
        UserId: 1,
        message: 'nice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'c489b7fa-5895-4ce7-b011-ae63a906759b',
        ChatId: 5,
        UserId: 2,
        message: 'hmmmm...',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'aeba2e78-2923-49cb-9baf-173ae1a2adf0',
        ChatId: 5,
        UserId: 3,
        message: ')))',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('ChatUsers', null, {});
    queryInterface.bulkDelete('ChatMessages', null, {});
    return queryInterface.bulkDelete('Chats', null, {});
  }
};
