import jwt from 'jsonwebtoken';
import Model from '../Base/Model';
import models from '../../db/models';

const {
  Organization: OrganizationModel,
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  User: UserModel,
  Tag: TagModel,
} = models;

class Organization extends Model {
  constructor() {
    super(OrganizationModel);
  }

  /**
   * Функция, генерирующая токен для доступа к роутам организации
   * @param {Object} loginData Данные для авторизации под организацией
   * @param {Object} loginData.organizationUUID uuid организации
   * @param {Object} loginData.userUUID uuid пользователя
   */
  loginAsOrganization({ organizationUUID, userUUID }) {
    return jwt.sign({
      organizationUUID,
      userUUID,
    }, 'secret');
  }
}

const organizationModel = new Organization();

/**
  * Функция для получения организации по его uuid
  */
organizationModel.getOrganizationByUUID = async (req, res) => {
  const { uuid } = req.params;
  const organization = await organizationModel.getByUUID(uuid);
  if (!organization) {
    return res.status(404).send({
      message: 'organization not found',
    });
  }

  const subscribers = await organization.getSubscribers({
    attributes: ['id'],
  });

  const organizers = (await organization.getOrganizers({
    attributes: ['id'],
    include: [
      { model: UserModel },
    ],
  })).map(organizer => organizer.User);

  const events = (await organization.getEvents({
    include: [
      {
        model: TicketModel,
        include: [
          { model: SubscriberModel },
        ],
      },
      {
        model: EventTagModel,
        attributes: ['id'],
        include: [
          {
            model: TagModel,
            attributes: ['name'],
          },
        ],
      },
    ],
  }))
    .map(event => ({
      uuid: event.uuid,
      name: event.name,
      description: event.description,
      datetimeTo: event.datetimeTo,
      coords: event.coords,
      datetimeFrom: event.datetimeFrom,
      subscribers: event.Tickets.length
        && event.Tickets.reduce((summ, ticket) => summ + ticket.Subscribers.length, 0),
      count: event.Tickets.length
        && event.Tickets.reduce((summ, ticket) => summ + ticket.count, 0),
      minPrice: event.Tickets.length
        && event.Tickets.filter((p, n) => (p.price > n.price ? 1 : -1))[0].price,

      tags: event.EventTags.map(eventTag => eventTag.Tag.name),
      tickets: event.Tickets,
    }));

  return res.status(200).send({
    subscribers: subscribers.length,
    organization,
    organizers,
    events,
  });
};

export default organizationModel;
