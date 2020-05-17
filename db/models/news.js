'use strict';
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter news title',
      },
      validate: {
        len: {
          args: [0, 100],
          msg: 'The length of the event title must be less than 100 symbols',
        },
      }
    },
    text: DataTypes.TEXT,
    image: DataTypes.STRING,
    OrganizationId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {});
  News.associate = models => {
    News.belongsTo(models.Organization);
    News.belongsTo(models.User);
  };
  return News;
};