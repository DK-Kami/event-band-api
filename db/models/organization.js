export default (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter organization name',
      },
      unique: {
        arg: true,
        msg: 'Organization name is already taken',
      },
      validate: {
        len: {
          args: [0, 100],
          msg: 'The length of the name must be less than 100',
        },
      }
    },
    reputation: {
      type: DataTypes.REAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        max: 10,
        min: 0,
      },
    },
    description: DataTypes.TEXT,
    logo: DataTypes.STRING,
  }, {});

  Organization.associate = models => {
    // associations can be defined here
    Organization.hasMany(models.Organizer);
    Organization.hasMany(models.Subscriber);
    Organization.hasMany(models.Event);
  };
  return Organization;
};