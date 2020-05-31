export default (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    EventId: DataTypes.INTEGER,
  }, {});
  Chat.associate = models => {
    // associations can be defined here
    Chat.hasMany(models.ChatMessage);
    Chat.belongsTo(models.Event);
  };
  return Chat;
};
