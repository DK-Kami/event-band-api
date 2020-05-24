import Router from "../../Base/Router";
import models from '../../../db/models';

const organizationEvent = new Router();
const {
  Subscriber: SubscriberModel,
  EventTag: EventTagModel,
  Ticket: TicketModel,
  Tag: TagModel,
} = models;

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
      subscribers: event.Tickets.reduce((summ, ticket) => summ + ticket.Subscribers.length, 0),
      count: event.Tickets.reduce((summ, ticket) => summ + ticket.count, 0),
      minPrice: event.Tickets.filter((p, n) => p.price > n.price ? 1 : -1)[0].price,

      tags: event.EventTags.map(eventTag => eventTag.Tag.name),
      tickets: event.Tickets,
    }));

  return res.status(200).send({ events });
});

export {
  organizationEvent,
};
