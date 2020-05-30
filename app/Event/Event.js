import Model from '../Base/Model';
import models from '../../db/models';
const {
  Event: EventModel,
} = models;

class Event extends Model {
  constructor() {
    super(EventModel);
  }

  /**
   * Метод, возращающий массив событий в отформатированном виде
   * @param {Array} events Массив событий, полученных ответом от сервера
   * @param {Function} done Колбэк-функция
   */
  async getFormattingEvents(events, done) {
    return events;
  }

  /**
   * Функция, возвращающая переданное событие в отформатированном виде
   * @param {Object} event Объект модели Event
   * @param {Function} done колбэк-функция
   */
  async getFormattingEvent(event, done) {
    return event;
  }

  /**
   * Функция для получения отфильтрованных событий
   */
  async getFilteredEvents(req, res) {
    const {
      priceTo = 1000000000000000000000000000000000,
      priceFrom = 0,
      reputation = 0,
      people = 0,
      dateFrom,
      dateTo,
      tags,
    } = req.query;

    const parseTags = tags && Array.isArray(tags)
      ? tags.map(tag => Number(tag))
      : [];

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
          attributes: ['uuid', 'name', 'description', 'count', 'price'],
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

      count: event.Tickets.reduce((summ, tticket) => summ + tticket.count, 0),
      price: event.Tickets.sort((n, p) => n.price > p.price ? 1 : -1)[0].price,

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
  }

  /**
   * Функция, возвращающая конкретное событие по uuid
   */
  async getCurrentEvent(req, res) {
    const { uuid: eventUUID } = req.params;

    let user;
    if (req.payload) {
      const { uuid } = req.payload;
      user = await User.getByUUID(uuid);
    }

    const event = await Event.getByUUID(eventUUID);
    if (!event) {
      return res.status(404).send({
        message: 'event not fount',
      });
    }

    const organization = await event.getOrganization();
    const tickets = await event.getTickets({
      include: [
        { model: SubscriberModel },
      ]
    })
      .map(ticket => ({
        uuid: ticket.uuid,
        name: ticket.name,
        description: ticket.description,
        count: ticket.count,
        price: ticket.price,
        datetimeTo: ticket.datetimeTo,
        datetimeFrom: ticket.datetimeFrom,
        subscribers: ticket.Subscribers.length,
        wasBuy: user && !!ticket.Subscribers.find(sub => sub.UserId === user.id)
      }));
    const tagIds = (await event.getEventTags()).map(eventTag => eventTag.TagId);

    const tags = await Tag.getAll({
      where: {
        id: {
          [Op.in]: tagIds,
        },
      },
    });

    return res.status(200).send({
      user,
      eventMeta: {
        subscribers: tickets.reduce((summ, ticket) => summ + ticket.subscribers, 0),
        count: tickets.reduce((summ, ticket) => summ + ticket.count, 0),
        minPrice: tickets.filter((p, n) => p.price > n.price ? 1 : -1)[0].price,
      },
      event,
      organization,
      tickets,
      tags,
    });
  }
};

export default new Event();
