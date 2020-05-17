import { Op } from 'sequelize';
import Router from '../Base/Router';
import Event from './Event';
import models from '../../db/models';
import Subscriber from '../Subscriber/Subscriber';
import Ticket from '../Ticket/Ticket';
import User from '../User/User';

const {
  Organization: OrganizationModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  Tag: TagModel,
} = models;
const eventRouter = new Router();
const publicEventRouter = new Router();

publicEventRouter.get('/event-list', async (req, res) => {
  const {
    priceTo = 1000000000000000000000000000000000,
    priceFrom = 0,
    reputation = 0,
    people = 0,
    dateFrom,
    dateTo,
    tags,
  } = req.query;

  const parseTags = (
    !tags || Array.isArray(tags)
      ? tags
      : JSON.parse(tags)
  ) || [];

  const where = {};

  if (dateFrom) {
    where['datetimeFrom'] = {
      [Op.gte]: new Date(dateFrom),
    }
  }
  if (dateTo) {
    where['datetimeTo'] = {
      [Op.lte]: new Date(dateTo),
    }
  }

  const events = await Event.getAll({
    where,
    attributes: ['uuid', 'name', 'description', 'datetimeTo', 'coords', 'datetimeFrom'],
    include: [
      {
        model: OrganizationModel,
        attributes: ['uuid', 'name', 'reputation', 'logo'],
        where: {
          reputation: {
            [Op.gte]: reputation,
          },
        },
      },
      {
        model: TicketModel,
        attributes: ['uuid', 'count', 'price'],
        where: {
          count: {
            [Op.gte]: people,
          },
          price: {
            [Op.between]: [priceFrom, priceTo],
          },
        },
      },
      {
        model: EventTagModel,
        attributes: ['TagId'],
        include: [
          {
            model: TagModel,
            attributes: ['name'],
          },
        ],
      },
    ],
  });

  if (!events) {
    res.status(200).send({ events: [] });
  }

  const formattingEvents = events.map(event => ({
    uuid: event.uuid,
    name: event.name,
    description: event.description,
    coords: event.coords,
    datetimeFrom: event.datetimeFrom,
    datetimeTo: event.datetimeTo,

    count: event.Tickets.reduce((summ, t) => summ + t.count, 0),
    price: event.Tickets.reduce((summ, t) => summ + t.price, 0),

    organization: event.Organization,
    tickets: event.Tickets.map(ticket => ticket),
    tags: event.EventTags.map(eventTag => ({
      id: eventTag.TagId,
      name: eventTag.Tag.name,
    })),
  }));

  const filterEvents = formattingEvents.filter(event => {
    if (tags && tags.length) {
      return event.tags.map(t => t.id).some(id => parseTags.includes(id));
    }
    return true;
  })

  res.status(200).send({
    events: filterEvents,
  });
  // res.status(200).send({ events });
});

publicEventRouter.post('/subscribe', async (req, res) => {
  const {
    ticketUuid,
    surname,
    email,
    name,
  } = req.body;

  Object.keys(req.body).forEach(key => {
    if (!req.body[key]) {
      res.status(400).send({
        message: key + ' is required',
      });
    }
  });

  try {
    const user = await User.getOrCreate({ surname, name, email });
    const { id: UserId } = user;

    const ticket = await Ticket.getByUUID(ticketUuid);
    const { id: TicketId } = ticket;

    const subscription = await Subscriber.getOrCreate({ TicketId, UserId }, { status: 1 });
    subscription.status = 1;
    subscription.save();

    res.status(200).send({
      message: 'nice dick, awesome balls',
      subscription,
    });
  }
  catch(message) {
    console.log(message);
    res.status(400).send({ message });
  }
});

eventRouter.get('/all', async (req, res) => {
  const events = await Event.getAll({
    attributes: ['uuid', 'name', 'description', 'datetimeTo', 'coords', 'datetimeFrom'],
    include: [
      {
        model: OrganizationModel,
        attributes: ['uuid', 'name', 'reputation', 'logo'],
      },
    ],
  });

  res.status(200).send({ events });
});
eventRouter.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const event = await Event.getByUUID(uuid);
  const organization = await event.getOrganization();
  const tickets = await event.getTickets();

  res.status(200).send({
    event,
    organization,
    tickets,
  });
});

eventRouter.get('/subscribe/:ticketUuid', async (req, res) => {
  const { ticketUuid } = req.params;
  const { userUUID } = req.payload;

  console.log(ticketUuid, userUUID);

  const { id: UserId } = await User.getByUUID(userUUID);
  const { id: TicketId } = await Ticket.getByUUID(ticketUuid);

  try {
    const subscription = await Subscriber.getOrCreate({
      TicketId,
      UserId,
    });

    console.log(subscription);
    subscription.status = 1;
    subscription.save();

    res.status(201).send({
      message: 'nice dick, awesome balls',
      subscription,
    });
  }
  catch(message) {
    console.error(message);
    res.status(400).send({ message });
  }
});
eventRouter.get('/unsubscribe/:ticketUuid', async (req, res) => {
  const { ticketUuid } = req.params;
  const { userUUID } = req.payload;

  console.log(ticketUuid, userUUID);

  const { id: UserId } = await User.getByUUID(userUUID);
  const { id: TicketId } = await Ticket.getByUUID(ticketUuid);

  try {
    const subscription = await Subscriber.getOne({
      where: {
        TicketId,
        UserId,
      },
    });

    console.log(subscription);
    if (!subscription) {
      throw new Error('not found your subscription');
    }

    subscription.status = 0;
    subscription.save();

    res.status(200).send({
      message: 'nice dick, awesome balls',
      subscription,
    });
  }
  catch(message) {
    res.status(400).send({ message });
  }
});

export {
  publicEventRouter,
  eventRouter,
}
