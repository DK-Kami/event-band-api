import Router from "../Base/Router";
import Organization from "./Organization";
import User from "../User/User";
import models from '../../db/models';

const {
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  User: UserModel,
  Tag: TagModel,
} = models;

const myOrganizationRouter = new Router();

/**
 * Middleware, обеспечивающий безопасность путей организации,
 * путём проверки, передаваемого токена и получения организации
 */
myOrganizationRouter.use(async (req, res, next) => {
  const {
    organizationUUID,
    userUUID,
  } = req.payload;

  if (!organizationUUID) {
    return res.status(403).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  const organization = await Organization.getByUUID(organizationUUID);
  const user = await User.getByUUID(userUUID);

  req.payload.organization = organization;
  req.payload.user = user;
  return next();
});

myOrganizationRouter.get('/', async (req, res) => {
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
      subscribers: event.Tickets.reduce((summ, ticket) => summ + ticket.Subscribers.length, 0),
      count: event.Tickets.reduce((summ, ticket) => summ + ticket.count, 0),
      minPrice: event.Tickets.filter((p, n) => p.price > n.price ? 1 : -1)[0].price,

      tags: event.EventTags.map(eventTag => eventTag.Tag.name),
      tickets: event.Tickets,
    }));

  return res.status(200).send({
    subscribers: subscribers.length,
    organization,
    organizers,
    events,
  });
});

export {
  myOrganizationRouter,
};
