import { v4 } from 'uuid';

export default (sequelize, DataTypes) => {
  const AuthorizedUser = sequelize.define('AuthorizedUser', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your nickname',
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
    },
    salt: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your nickname',
      },
      validate: {
        len: {
          args: [6, 100],
          msg: 'The length of the name must be less than 30 and more than 6',
        },
      }
    },
  }, {});

  AuthorizedUser.associate = models => {
    // associations can be defined here
    AuthorizedUser.belongsTo(models.User);
  };

  AuthorizedUser.beforeCreate(user => user.uuid = v4());
  return AuthorizedUser;
};
