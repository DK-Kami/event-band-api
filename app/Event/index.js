import { Op } from 'sequelize';
import Router from '../Base/Router';
import Event from './Event';
import models from '../../db/models';
import Subscriber from '../Subscriber/Subscriber';
import Ticket from '../Ticket/Ticket';
import User from '../User/User';
import News from '../News/News';
import Tag from '../Tag/Tag';

const {
  Organization: OrganizationModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  Event: EventModel,
  News: NewsModel,
  Tag: TagModel,
} = models;
const publicEventRouter = new Router();
const eventRouter = new Router();

/**
 * Функция для получения отфильтрованных событий
 */
async function getFilteredEvents(req, res) {
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
      ? tags.map(tag => Number(tag))
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
            [Op.lte]: people,
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
};

/**
 * Путь для получения отфильтрованных событий неаторизованным пользователем
 */
publicEventRouter.get('/event-list', getFilteredEvents);
/**
 * Путь для подписки на событие неавторизованным пользователем
 */
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
    const { model: user } = await User.getOrCreate({ surname, name, email });
    const { id: UserId } = user;

    const ticket = await Ticket.getByUUID(ticketUuid);
    const { id: TicketId } = ticket;

    const {
      model: subscription,
      isCreate
    } = await Subscriber.getOrCreate({ TicketId, UserId }, { status: 1 });

    if (isCreate) {
      res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      res.status(400).send({
        message: 'email address is already registered at the event',
      });
    }
  }
  catch(message) {
    console.log(message);
    res.status(400).send({ message });
  }
});

/**
 * Получение новостей от организаций, на которые подписан пользователь
 */
eventRouter.get('/event-feed', async (req, res) => {
  const { userUUID } = req.payload;
  const { id: userId } = await User.getByUUID(userUUID);
  const userOrganizations = await Subscriber.getAll({
    where: {
      OrganizationId: {
        [Op.gt]: 0,
      },
      UserId: userId,
    },
    attributes: ['uuid'],
    include: [
      {
        model: OrganizationModel,
        attributes: ['id'],
      },
    ],
    raw: true,
  });
  const orgIds = userOrganizations.map(org => org['Organization.id']);

  const news = await News.getAll({
    attributes: ['uuid', 'title', 'text', 'image', 'createdAt'],
    order: [['createdAt', 'DESC']],
    where: {
      OrganizationId: {
        [Op.in]: orgIds
      },
    },
    include: [
      {
        model: OrganizationModel,
        attributes: ['uuid', 'name', 'logo'],
      },
    ],
  });

  res.status(200).send({ news });
});
/**
 * Получение рекомендованных организаций и событий
 */
eventRouter.get('/event-recommended', async (req, res) => {
  const { userUUID } = req.payload;
  const { id: userId } = await User.getByUUID(userUUID);
  const userSubscription = await Subscriber.getAll({
    where: {
      UserId: userId,
    },
    attributes: ['uuid'],
    include: [
      {
        model: OrganizationModel,
        attributes: ['id'],
      },
      {
        model: TicketModel,
        attributes: ['id'],
        include: [
          {
            model: EventModel,
            attributes: ['id'],
            include: [
              {
                model: EventTagModel,
                attributes: ['id'],
                include: [
                  {
                    model: TagModel,
                    attributes: ['id'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    raw: true,
  });

  const orgIds = [...new Set(userSubscription.map(sub => sub['Organization.id']).filter(orgId => !!orgId))];
  const eventIds = [...new Set(userSubscription.map(sub => sub['Ticket.Event.id']).filter(eventId => !!eventId))];
  const tagIds = [...new Set(userSubscription.map(sub => sub['Ticket.Event.EventTags.Tag.id']).filter(tagId => !!tagId))];

  const filteredEvents = (await Event.getAll({
    where: {
      id: {
        [Op.notIn]: eventIds,
      },
    },
    attributes: ['id', 'uuid', 'name', 'description', 'coords', 'datetimeTo', 'datetimeFrom'],
    include: [
      {
        model: OrganizationModel,
        attributes: ['id', 'uuid', 'name', 'description', 'logo'],
      },
      {
        model: EventTagModel,
        attributes: ['id'],
        include: [
          {
            model: TagModel,
            attributes: ['id', 'uuid', 'name'],
            where: {
              id: {
                [Op.in]: tagIds,
              },
            },
          },
        ],
      },
    ],
  })).filter(e => e.EventTags.length);

  const eventIdsToOrgs = [...eventIds, ...filteredEvents.map(event => event.id)];
  const filteredOrgs = (await Event.getAll({
    where: {
      id: {
        [Op.in]: eventIdsToOrgs,
      },
    },
    include: [
      {
        model: OrganizationModel,
        attributes: ['id', 'uuid', 'name', 'description', 'logo'],
      },
    ],
  }))
    .map(event => event.Organization)
    .filter(org => !orgIds.includes(org.id));
  const recommendedOrgs = filteredOrgs;

  const recommendedEvents = filteredEvents.map(event => {
    const tags = event.EventTags.map(eventTag => ({
      id: eventTag.Tag.id,
      uuid: eventTag.Tag.uuid,
      name: eventTag.Tag.name,
    }));

    return {
      uuid: event.uuid,
      name: event.name,
      description: event.description,
      coords: event.coords,
      datetimeTo: event.datetimeTo,
      datetimeFrom: event.datetimeFrom,
      tags,
    };
  });

  res.status(200).send({
    organizations: recommendedOrgs,
    events: recommendedEvents,
  });
}),

/**
 * Путь для получения отфильтрованных событий аторизованным пользователем
 */
eventRouter.get('/event-list', getFilteredEvents);
/**
 * Возвращение всех событий
 */
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
/**
 * Возвращение конкретного события для uuid
 */
eventRouter.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const event = await Event.getByUUID(uuid);
  const organization = await event.getOrganization();
  const tickets = await event.getTickets();
  const tagIds = (await event.getEventTags()).map(eventTag => eventTag.TagId);
  const tags = await Tag.getAll({
    where: {
      id: {
        [Op.in]: tagIds,
      },
    },
  });

  res.status(200).send({
    event,
    organization,
    tickets,
    tags,
  });
});

/**
 * Подписка на событие авторизованным пользователем
 */
eventRouter.get('/subscribe/:ticketUuid', async (req, res) => {
  const { ticketUuid } = req.params;
  const { userUUID } = req.payload;

  console.log(ticketUuid, userUUID);

  const { id: UserId } = await User.getByUUID(userUUID);
  const { id: TicketId } = await Ticket.getByUUID(ticketUuid);

  try {
    const {
      model: subscription,
      isCreate
    } = await Subscriber.getOrCreate({ TicketId, UserId }, { status: 1 });

    if (isCreate) {
      res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      res.status(400).send({
        message: 'email address is already registered at the event',
      });
    }
  }
  catch(message) {
    console.error(message);
    res.status(400).send({ message });
  }
});
/**
 * Отписка от события авторизованным пользователем
 */
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
