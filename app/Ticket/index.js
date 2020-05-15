import Router from "../Base/Router";
import Ticket from './Ticket';
import models from '../../db/models';

const {
  Organization,
  Event,
} = models;

const ticketRouter = new Router();

ticketRouter.get('/all', async (req, res) => {
  const tickets = await Ticket.getAll({
    attributes: ['uuid', 'name', 'description', 'count', 'price', 'datetimeTo', 'datetimeFrom'],
    include: [
      {
        model: Event,
        attributes: ['uuid', 'name', 'description', 'coords', 'datetimeTo', 'datetimeFrom'],
        include: [
          {
            model: Organization,
            attributes: ['uuid', 'name', 'reputation', 'logo'],
          },
        ],
      },
    ]
  })

  res.status(200).send({ tickets });
});

export {
  ticketRouter,
};
