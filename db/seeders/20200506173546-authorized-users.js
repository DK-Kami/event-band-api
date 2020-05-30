'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('AuthorizedUsers', [
      {
        uuid: '8f5a6be3-a464-40ea-A032-ac228b1c1dc7',
        nickname: 'test',
        refreshToken: '',
        UserId: 1,
        token: '',
        salt: '9d87ebcd3ed0a2ba591b2d8cd3c55159',
        password: '302e5f5f91c344830a23dc7076c9dedb74ee4bac523dd62b505ca815b51bfaedd39268736e4b9e6bcc5e6a1fd70b356c6f6da159df6e9cb47b62870631691e08af780a9bcafb585830d0f0ef8d0f36d03cd02322a0b8258854f74a4da11134eb40845c1e4e18cc5cfca7c7e06dcdb5a4b63423a6be61994495f442f27e9e52e43fdae2f636f43103f8c944f3f3e538cd9f329cb4faa6b641ea0bea5ef6402bc2bc30e131b8087c37e1fdc26da20c2b0eddac8022c6f9d32d24797dba8a2484a885b90c0cbf888091565e013c62304a83987d71aa8fefef3d624ce77f235d5c308b9b6f00ae3683288492092309a49e948d60ba8dcd22cfbc2623ed3d683107b4a362783c812f1f6e767d44ca9a22fe13fc991a000672cfd7b0468081fe65a5e1151ba5607289a345f50b23e500283fc2a57fef26654fd7f3e0acbd197337dddea732670c8aa02f509aa878d63c1cd544ce83a091af792672b2c71fd8a0505edbb3896ee12d56931f5d717680743e3cbacfb27fdfd8f92091a0d6c65c67b69c60f8c13464214894114ad4d12521de3b2f2664c787e869108208c0d865c037c9942831c47af4ab4a3426fb6f4227ec8420c5cc378ed8b45cde6ff181d13ab9e260185d4314219acaac1b70c349d82ea34f0f6084ef39b9dc09535c5ef3397836758a53070b34b3703455df63041d58c7ed67ccbab4f5abdbdb0450fb11c48a59e5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: 'b1eb1f90-e330-4a10-9a65-5d2a61886d51',
        nickname: 'Main Admin',
        refreshToken: '',
        UserId: 2,
        token: '',
        salt: '7f55ed4ab39eec0222a9f0c0025c87c8',
        password: 'c27d4305a0d56acb05600d4926f98f89804fe633113ae530d8ef02397baa9b2116ab5009895f0574fb0fcd192e5751210c12d00da8698e9b8555d561cff921b91b4ababfd93303ac2d5e1c2246bbf37b8c9d29a3e61de4b3ed616e19662429c5c3b36db863ec17f212cdbe427b128c88e015836a7f43e99d17377ef42fed7468ba34d1f17a731795c74436f9c181bac879d4abf1a441e171bb846460e0cb976f0b0c955c650bcbd19f1e5a250c7521aceab155a38568d712061745d0d3689b2bb773dadb9ac3cfc3e1b1b9fa1b7f8499f2a2e0f764eb2fa875b4235403997ff2181e2bc1cbacbacc5a1c3083536e22ad2e262977133a2a60a4b43bbd53f1c21e916f362ac6a42fbbf87356d6045a2b982223c40e48132993cb692b3ab5125760c5afddba321f6a5ef4c87a142115522fd4155a34430f90c0c975f1a32f0394bfd2fa9ea705fcee7a492ee9bdd45e960f88dc20f9620b10889f9709cb6c02c0057b7de8dd50da9ecd5c5f9573d9bf87f21d3e86a614a79144a1e740649c2e5fdb1bbeca265f2e8fec38e15a90cb38430cc2f1f5f85e7d463cdc50132913d822fea675f3136e20fcff15474e1574890e5d4a79c08de7d65ee50ad9def4f218d4206704defb5bda4aadfb9cc5dd0abd354002b8152f69d396c2dd04b52c98069b3861f178fb92c4abe49667b30eb2816fc14ca74b55df0e426ca3ed604cff7cb89f',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: '311e181a-7d9e-481d-a586-5e88a45afdb4',
        nickname: 'js ninja',
        refreshToken: '',
        UserId: 3,
        token: '',
        salt: '7f55ed4ab39eec0222a9f0c0025c87c8',
        password: 'c27d4305a0d56acb05600d4926f98f89804fe633113ae530d8ef02397baa9b2116ab5009895f0574fb0fcd192e5751210c12d00da8698e9b8555d561cff921b91b4ababfd93303ac2d5e1c2246bbf37b8c9d29a3e61de4b3ed616e19662429c5c3b36db863ec17f212cdbe427b128c88e015836a7f43e99d17377ef42fed7468ba34d1f17a731795c74436f9c181bac879d4abf1a441e171bb846460e0cb976f0b0c955c650bcbd19f1e5a250c7521aceab155a38568d712061745d0d3689b2bb773dadb9ac3cfc3e1b1b9fa1b7f8499f2a2e0f764eb2fa875b4235403997ff2181e2bc1cbacbacc5a1c3083536e22ad2e262977133a2a60a4b43bbd53f1c21e916f362ac6a42fbbf87356d6045a2b982223c40e48132993cb692b3ab5125760c5afddba321f6a5ef4c87a142115522fd4155a34430f90c0c975f1a32f0394bfd2fa9ea705fcee7a492ee9bdd45e960f88dc20f9620b10889f9709cb6c02c0057b7de8dd50da9ecd5c5f9573d9bf87f21d3e86a614a79144a1e740649c2e5fdb1bbeca265f2e8fec38e15a90cb38430cc2f1f5f85e7d463cdc50132913d822fea675f3136e20fcff15474e1574890e5d4a79c08de7d65ee50ad9def4f218d4206704defb5bda4aadfb9cc5dd0abd354002b8152f69d396c2dd04b52c98069b3861f178fb92c4abe49667b30eb2816fc14ca74b55df0e426ca3ed604cff7cb89f',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AuthorizedUsers', null, {});
  }
};
