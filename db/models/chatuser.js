export default (sequelize, DataTypes) => {
  const ChatUser = sequelize.define('ChatUser', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    UserId: DataTypes.UUID,
    ChatId: DataTypes.UUID,
  }, {});
  ChatUser.associate = models => {
    // associations can be defined here
    ChatUser.belongsTo(models.Chat);
    ChatUser.belongsTo(models.User);
  };
  return ChatUser;
};
