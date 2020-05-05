import { v4 } from 'uuid';

export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
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
        msg: 'Please enter name tag',
      },
      unique: {
        args: true,
        msg: 'Name tag is already taken',
      },
    },
  }, {});

  Tag.associate = models => {
    // associations can be defined here
    Tag.hasMany(models.Event);
  };

  Tag.beforeCreate(tag => tag.uuid = v4());
  return Tag;
};