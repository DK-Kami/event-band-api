'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Chats', [
      {
        uuid: '1df29884-bf9b-453b-8434-ddf3537d0b05',
        EventId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '40f934ca-35cb-4707-b3dd-c53c6c0538dc',
        EventId: 2,
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

      {
        uuid: '1b7d49c8-dcbe-4006-9405-c3a1124e61b1',
        EventId: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '48d1077c-b247-4089-8ee2-0d219e791293',
        EventId: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '7fb05e96-48d1-4816-adbc-2a7e349f9603',
        EventId: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '3c038b60-906e-4dc2-bdc2-c45beed91fad',
        EventId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'b44f71ed-6e10-45fd-a5eb-ece742c0d561',
        EventId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'efaa3f24-18ea-4bef-af0e-6558eff04747',
        EventId: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '4fffeeef-c950-47df-8715-d2c589649103',
        EventId: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '0dda36d0-ac7e-42d3-9fc1-dac608e7d355',
        EventId: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '071418b7-5b44-4a1b-a768-6bffd4224e07',
        EventId: 14,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '135eb8cc-ee64-4d22-941a-f7054295da67',
        EventId: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '9598f208-aa54-4afc-93f3-afcf107c11e5',
        EventId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'c6a4cfea-058d-4396-88b2-164e7028334b',
        EventId: 17,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '76c82a36-3013-424d-a594-b674f6db38bc',
        EventId: 18,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '1c68da5f-9934-44d3-bd2a-b29b0b095739',
        EventId: 19,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'aada512d-686b-4cf0-bae8-cc841278f6a0',
        EventId: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '122a43b3-e045-4991-84ad-2aefde5c9541',
        EventId: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'c6974dad-3a11-4bda-9843-2339173c55f9',
        EventId: 22,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'de316c89-f05e-4717-87ca-046f8503ba38',
        EventId: 23,
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
    queryInterface.bulkDelete('ChatMessages', null, {});
    return queryInterface.bulkDelete('Chats', null, {});
  }
};
