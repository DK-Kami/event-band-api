import models from '../../../db/models';
import Router from '../../Base/Router';
import Organization from '../Organization';
import User from '../../User/User';

const someOrganizationRouter = new Router();
const {
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  User: UserModel,
  Tag: TagModel,
} = models;

async function getOrganization(req, res) {
  const {
    organizationUUID,
    userUUID,
  } = req.payload;

  console.log('are u clown?', organizationUUID, userUUID);
  if (!organizationUUID) {
    return res.status(400).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  // const organization = await Organization.getByUUID(organizationUUID);
  const organization = await Organization.getByUUID('989713f3-2f0b-4a14-b863-d98b5c00f94e');
  const user = await User.getByUUID(userUUID);

  req.payload.organization = organization;
  req.payload.user = user;
}

/**
 * Путь для получения текущей организации
 */
someOrganizationRouter.get('/', async (req, res) => {
  await getOrganization(req, res);
  const { organization } = req.payload;

  const subscribers = await organization.getSubscribers({
    attributes: ['id'],
  });

  const organizers = (await organization.getOrganizers({
    where: {
      status: 1,
    },
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
