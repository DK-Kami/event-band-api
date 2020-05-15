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
    status: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      default: 1
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