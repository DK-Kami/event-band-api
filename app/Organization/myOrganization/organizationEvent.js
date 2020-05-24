import Router from "../../Base/Router";
import models from '../../../db/models';
import EventTag from '../../EventTag/EventTag';
import Ticket from '../../Ticket/Ticket';
import Event from '../../Event/Event';
import { Op } from "sequelize";

const organizationEvent = new Router();
const {
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  Tag: TagModel,
} = models;

/**
 * Получение всех событий организации
 */
organizationEvent.get('/all', async (req, res) => {
  const { organization } = req.payload;
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
      tickets: event.Tickets,
    }));

  return res.status(200).send({ events });
});
/**
 * Путь для создания события организация
 */
organizationEvent.post('/create', async (req, res) => {
  const { organization } = req.payload;
  const OrganizationId = organization.id;
  const {
    name,
    description,
    count,
    coords,
    datetimeTo,
    datetimeFrom,
    tickets: ticketIds,
    tags: tagIds,
  } = req.body;

  Event.create(
    { name, description, count, coords, datetimeTo, datetimeFrom, OrganizationId },
    async (message, event) => {
      if (message) {
        return res.status(400).send({ message });
      }

      const { id: EventId } = event;
      const tickets = await Ticket.getAll({
        where: {
          id: {
            [Op.in]: ticketIds,
          },
        },
      });

      await Promise.all(tickets.map(async ticket => {
        ticket.EventId = event.id;
        await ticket.save();
      }));      
      await Promise.all(tagIds.map(async TagId => {
        await EventTag.create({ TagId, EventId });
      }));

      return res.status(201).send({
        event,
        tickets,
      });
    }
  );
});


organizationEvent.put('/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const event = await Event.getByUUID(uuid);
  if (!event) {
    return res.status(404).send({
      message: 'event not found',
    });
  }

  Event.update(
    req.body,
    { uuid },
    async (message) => {
      if (message) {
        return res.status(400).send({ message });
      }

      const event = await Event.getByUUID(uuid);
      return res.status(200).send({ event });
    }
  )
});

export {
  organizationEvent,
};
