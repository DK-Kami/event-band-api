'use strict';
module.exports = (sequelize, DataTypes) => {
  const EventTag = sequelize.define('EventTag', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    EventId: DataTypes.INTEGER,
    TagId: DataTypes.INTEGER,
  }, {});
  EventTag.associate = function(models) {
    // associations can be defined here
    EventTag.belongsTo(models.Event);
    EventTag.belongsTo(models.Tag);
  };
  return EventTag;
};