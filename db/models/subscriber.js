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
    OrganizationId: {
      type: DataTypes.INTEGER,
    },
    TicketId: {
      type: DataTypes.INTEGER,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
  }, {});

  Subscriber.associate = models => {
    // associations can be defined here
    Subscriber.belongsTo(models.Organization);
    Subscriber.belongsTo(models.Ticket);
    Subscriber.belongsTo(models.User);
  };
  return Subscriber;
};