import { Op } from 'sequelize';
import Router from '../Base/Router';
import Event from './Event';
import models from '../../db/models';
import Subscriber from '../Subscriber/Subscriber';
import Ticket from '../Ticket/Ticket';
import User from '../User/User';
import News from '../News/News';

const {
  Organization: OrganizationModel,
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  Event: EventModel,
  Tag: TagModel,
} = models;
const publicEventRouter = new Router();
const eventRouter = new Router();

/**
 * Путь для получения отфильтрованных событий неаторизованным пользователем
 */
publicEventRouter.get('/event-list', Event.getFilteredEvents);
/**
 * Возвращение конкретного события для uuid
 */
publicEventRouter.get('/event/:uuid', Event.getCurrentEvent);
/**
 * Путь для подписки на событие неавторизованным пользователем
 */
publicEventRouter.post('/subscribe', (req, res) => {
  const {
    ticketUuid,
    surname,
    email,
    name,
  } = req.body;

  User.getOrCreate(
    { surname, name, email },
    {},
    async (message, userModel) => {
      if (message) {
        return res.status(400).send({ message });
      }
      const {
        model: user,
      } = userModel;

      const ticket = await Ticket.getByUUID(ticketUuid);
      if (!ticket) {
        return res.status(400).send({
          message: 'ticket not found',
        });
      }
    
      const { id: TicketId } = ticket;
      const { id: UserId } = user;
      Subscriber.getOrCreate({ TicketId, UserId }, { status: 1 }, (message, subscriber) => {
        if (message) {
          return res.status(400).send({ message });
        }

        const {
          model: subscription,
          isCreate,
        } = subscriber;
    
        if (isCreate || !subscription.status) {
          subscription.status = 1;
          subscription.save();
    
          return res.status(201).send({
            message: 'nice dick, awesome balls',
            subscription,
          });
        }
        else {
          return res.status(400).send({
            message: 'email address is already registered at the event',
          });
        }
      });
    }
  );
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
      status: 1,
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
        model: TicketModel,
        attributes: ['uuid', 'name', 'description', 'count', 'price', 'datetimeTo', 'datetimeFrom'],
        include: [
          {
            model: SubscriberModel,
            attributes: ['id'],
          },
        ],
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

  const recommendedOrgs = [];
  (await Event.getAll({
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
    .filter(org => !orgIds.includes(org.id))
    .forEach(organization => {
      if (!recommendedOrgs.map(org => org.id).includes(organization.id)) {
        recommendedOrgs.push(organization);
      }
    });

  const recommendedEvents = filteredEvents.map(event => {
    const tags = event.EventTags.map(eventTag => ({
      id: eventTag.Tag.id,
      uuid: eventTag.Tag.uuid,
      name: eventTag.Tag.name,
    }));

    const tickets = event.Tickets.map(ticket => ({
      uuid: ticket.uuid,
      name: ticket.name,
      description: ticket.description,
      count: ticket.count,
      price: ticket.price,
      datetimeFrom: ticket.datetimeFrom,
      datetimeTo: ticket.datetimeTo,
      subscribers: ticket.Subscribers.length,
    }));

    return {
      uuid: event.uuid,
      name: event.name,
      description: event.description,
      coords: event.coords,
      datetimeTo: event.datetimeTo,
      datetimeFrom: event.datetimeFrom,
      subscribers: tickets.length && tickets.reduce((summ, ticket) => summ + ticket.subscribers, 0),
      count: tickets.length && tickets.reduce((summ, ticket) => summ + ticket.count, 0),
      minPrice: tickets.length && tickets.filter((p, n) => p.price > n.price ? 1 : -1)[0].price,
      organization: event.Organization,
      tickets,
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
eventRouter.get('/event-list', Event.getFilteredEvents);
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
eventRouter.get('/:uuid', Event.getCurrentEvent);

/**
 * Подписка на событие авторизованным пользователем
 */
eventRouter.get('/subscribe/:ticketUuid', async (req, res) => {
  const { ticketUuid } = req.params;
  const { userUUID } = req.payload;

  const ticket = await Ticket.getByUUID(ticketUuid);
  if (!ticket) {
    res.status(404).send({
      message: 'ticket not found'
    })
  }
  
  const { id: TicketId } = ticket;
  const { id: UserId } = await User.getByUUID(userUUID);

  Subscriber.getOrCreate({ TicketId, UserId }, { status: 1 }, (message, subscriberData) => {
    if (message) {
      console.error(message);
      return res.status(400).send({ message });
    }

    const {
      model: subscription,
      isCreate
    } = subscriberData;

    if (isCreate || !subscription.status) {
      subscription.status = 1;
      subscription.save();

      return res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      return res.status(400).send({
        message: 'email address is already registered at the event',
      });
    }
  });
});
/**
 * Отписка от события авторизованным пользователем
 */
eventRouter.get('/unsubscribe/:ticketUuid', async (req, res) => {
  const { ticketUuid } = req.params;
  const { userUUID } = req.payload;

  console.log(ticketUuid, userUUID);
  const ticket = await Ticket.getByUUID(ticketUuid);
  console.log(ticket);
  if (!ticket) {
    return res.status(404).send({
      message: 'ticket not found',
    });
  }
  
  const { id: TicketId } = ticket;
  const { id: UserId } = await User.getByUUID(userUUID);

  const subscription = await Subscriber.getOne({
    where: {
      TicketId,
      UserId,
    },
  });

  if (!subscription) {
    return res.status(404).send({
      message: 'not found your subscription',
    });
  }

  subscription.status = 0;
  await subscription.save();

  return res.status(200).send({
    message: 'nice dick, awesome balls',
    subscription,
  });
});

export {
  publicEventRouter,
  eventRouter,
}
