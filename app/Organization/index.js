import Router from '../Base/Router';
import Organizer from '../Organizer/Organizer';
import Organization from './Organization';
import User from '../User/User';
import Subscriber from '../Subscriber/Subscriber';
import models from '../../db/models';

const publicOrganizationRouter = new Router();
const organizationRouter = new Router();

const {
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  User: UserModel,
  Tag: TagModel,
} = models;

/**
 * Функция для получения организации по его uuid
 */
async function getOrganizationByUUID(req, res) {
  const { uuid } = req.params;
  const organization = await Organization.getByUUID(uuid);
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
      subscribers: event.Tickets.length && event.Tickets.reduce((summ, ticket) => summ + ticket.Subscribers.length, 0),
      count: event.Tickets.length && event.Tickets.reduce((summ, ticket) => summ + ticket.count, 0),
      minPrice: event.Tickets.length && event.Tickets.filter((p, n) => p.price > n.price ? 1 : -1)[0].price,

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

/**
 * [DEBUG] Получение всех организаций
 */
organizationRouter.get('/all', async (req, res) => {
  const organizations = await Organization.getAll();
  return res.status(200).send({ organizations });
});
/**
 * Путь для создания новой организации
 */
organizationRouter.post('/create', async (req, res) => {
  const {
    description,
    name,
    logo,
  } = req.body;
  const { uuid } = req.payload;

  const user = await User.getByUUID(uuid);
  const createData = {
    reputation: 1,
    description,
    name,
    logo,
  };

  Organization.create(createData, (message, organization) => {
    if (message) {
      return res.status(400).send({ message });
    }

    Organizer.create({
      OrganizationId: organization.id,
      UserId: user.id,
      status: 1,
    }, (message) => {
      if (message) {
        return res.status(400).send({ message });
      }

      return res.status(201).send({ organization });
    });
  });
});

/**
 *  Получение конкретной организации по uuid для неавторизованных пользователей
 */
publicOrganizationRouter.get('/:uuid', getOrganizationByUUID);
/**
 *  Получение конкретной организации по uuid для авторизованных пользователей
 */
organizationRouter.get('/:uuid', getOrganizationByUUID);

/**
 * Подписка на организацию
 */
organizationRouter.get('/subscribe/:uuid', async (req, res) => {
  const { uuid: OrganizationUUID } = req.params;
  const { userUUID } = req.payload;

  const organization = await Organization.getByUUID(OrganizationUUID);
  if (!organization) {
    return res.status(404).send({
      message: 'organization not found',
    });
  }

  const { id: OrganizationId } = organization;
  const { id: UserId } = await User.getByUUID(userUUID);

  Subscriber.getOrCreate({ OrganizationId, UserId }, { status: 1 }, (message, subscriptionData) => {
    if (message) {
      return res.status(400).send({ message });
    }
    const {
      model: subscription,
      isCreate,
    } = subscriptionData;

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
        message: 'email address is already in this organization',
      });
    }
  });
});
/**
 * Подписка на организации
 */
organizationRouter.get('/unsubscribe/:uuid', async (req, res) => {
  const { uuid: OrganizationUUID } = req.params;
  const { userUUID } = req.payload;

  const organization = await Organization.getByUUID(OrganizationUUID);
  if (!organization) {
    res.send(404).send({
      message: 'organization not found',
    });
  }

  const { id: OrganizationId } = organization;
  const { id: UserId } = await User.getByUUID(userUUID);

  try {
    const subscription = await Subscriber.getOne({
      where: { OrganizationId, UserId },
    });

    if (subscription.status) {
      subscription.status = 0;
      subscription.save();

      res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      res.status(400).send({
        message: 'you are already out of this organization',
      });
    }
  }
  catch(message) {
    console.error(message);
    res.status(400).send({ message });
  }
});

/**
 * Путь для регистрации под организацию
 */
organizationRouter.get('/login/:organizationUUID', async (req, res) => {
  const { organizationUUID } = req.params;
  const { userUUID } = req.payload;

  const organization = await Organization.getByUUID(organizationUUID);
  if (!organization) {
    return res.status(404).send({
      message: 'Organization not found',
    });
  }
  const user = await User.getByUUID(userUUID);

  const organizer = await Organizer.getOne({
    where: {
      OrganizationId: organization.id,
      UserId: user.id,
    }
  });
  if (!organizer) {
    return res.status(403).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  const organizationToken = await Organization.loginAsOrganization({
    organizationUUID,
    userUUID,
  });
  return res.status(200).send({ organizationToken });
});

export {
  publicOrganizationRouter,
  organizationRouter,
};
