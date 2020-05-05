import { v4 } from 'uuid';

export default (sequelize, DataTypes) => {
  const Organizator = sequelize.define('Organizator', {
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
    userId: {
      type: DataTypes.INTEGER,
    },
    orgId: {
      type: DataTypes.INTEGER,
    },
  }, {});

  Organizator.associate = models => {
    // associations can be defined here
    Organizator.belongsTo(models.Organization);
    Organizator.belongsTo(models.User);
  };

  Organizator.beforeCreate(organizator => organizator.uuid = v4());
  return Organizator;
};