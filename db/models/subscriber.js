export default (sequelize, DataTypes) => {
  const Subscriber = sequelize.define('Subscriber', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    orgId: {
      type: DataTypes.INTEGER,
    },
    eventId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  }, {});

  Subscriber.associate = models => {
    // associations can be defined here
    Subscriber.belongsTo(models.Organization);
    Subscriber.belongsTo(models.Event);
    Subscriber.belongsTo(models.User);
  };
  return Subscriber;
};