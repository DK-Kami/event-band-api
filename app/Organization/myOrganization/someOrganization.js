import models from '../../../db/models';
import Router from '../../Base/Router';
import Organization from '../Organization';

const someOrganizationRouter = new Router();
const {
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  User: UserModel,
  Tag: TagModel,
} = models;

/**
 * Путь для получения текущей организации
 */
someOrganizationRouter.get('/', async (req, res) => {
  const { organization } = req.payload;

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
          {
            model: SubscriberModel,
            attributes: ['uuid'],
          },
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
      subscribers: event.Tickets.length && event.Tickets.reduce((summ, ticket) => summ + ticket.Subscribers.length, 0),
      count: event.Tickets.length && event.Tickets.reduce((summ, ticket) => summ + ticket.count, 0),
      minPrice: event.Tickets.length && event.Tickets.filter((p, n) => p.price > n.price ? 1 : -1)[0].price,

      tags: event.EventTags.map(eventTag => eventTag.Tag.name),
      tickets: event.Tickets.length && event.Tickets,
    }));

  return res.status(200).send({
    subscribers: subscribers.length,
    organization,
    organizers,
    events,
  });
});
/**
 * Путь для изменения текущей организации
 */
someOrganizationRouter.put('/', (req, res) => {
  const { organizationUUID } = req.payload;
  const {
    description,
    name,
    logo,
  } = req.body;

  Organization.update(
    { description, name, logo },
    { uuid: organizationUUID },
    async (message) => {
      if (message) {
        return res.status(400).send({ message });
      }
    
      const organization = await Organization.getByUUID(organizationUUID);
      return res.status(200).send({ organization });
    },
  );
});

export {
  someOrganizationRouter,
};
