import { Op, BIGINT } from 'sequelize';
import Router from '../Base/Router';
import Event from './Event';
import models from '../../db/models';

const {
  Organization,
  EventTag,
  Ticket,
  Tag,
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

  const parseTags = Array.isArray(tags)
    ? tags
    : JSON.parse(tags);

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
        model: Organization,
        attributes: ['uuid', 'name', 'reputation', 'logo'],
        where: {
          reputation: {
            [Op.gte]: reputation,
          },
        },
      },
      {
        model: Ticket,
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
        model: EventTag,
        attributes: ['TagId'],
        include: [
          {
            model: Tag,
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

export {
  publicEventRouter,
  eventRouter,
}
