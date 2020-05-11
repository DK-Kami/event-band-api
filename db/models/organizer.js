export default (sequelize, DataTypes) => {
  const Organizer = sequelize.define('Organizer', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    status: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  }, {});

  Organizer.associate = models => {
    // associations can be defined here
    Organizer.belongsTo(models.Organization);
    Organizer.belongsTo(models.User);
  };
  return Organizer;
};