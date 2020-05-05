import { v4 } from 'uuid';

export default (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        isUUID: 4,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter event name',
      },
      validate: {
        len: {
          args: [0, 100],
          msg: 'Event name must be less than 100',
        },
      },
    },
    description: DataTypes.TEXT,
    count: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        msg: 'Please enter the cont of participants in the event',
      },
      defaultValue: 0,
    },
    price: DataTypes.INTEGER,
    datetimeTo: {
      type: DataTypes.DATE,
      allowNull: {
        args: false,
        msg: 'Please enter the event start date',
      },
    },
    datetimeFrom: DataTypes.DATE,
    eventId: {
      type: DataTypes.INTEGER,
    },
  }, {});

  Ticket.associate = models => {
    // associations can be defined here
    Ticket.belongsTo(models.Event);
  };

  Ticket.beforeCreate(ticket => ticket.uuid = v4());
  return Ticket;
};