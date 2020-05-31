export default (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    message: DataTypes.STRING,
    ChatId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
  }, {});
  ChatMessage.associate = models => {
    // associations can be defined here
    ChatMessage.belongsTo(models.Chat);
    ChatMessage.belongsTo(models.User);
  };
  return ChatMessage;
};
