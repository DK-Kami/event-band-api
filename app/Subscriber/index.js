import Router from "../Base/Router";
import Subscriber from "./Subscriber";
import models from '../../db/models';

const subscriberRouter = new Router();

const {
  Organization,
  Ticket,
  Event,
} = models;

subscriberRouter.get('/all', async (res, req) => {
  const subscribers = await Subscriber.getAll({
    attributes: ['uuid'],
    include: [
      {
        model: Organization,
        attributes: ['uuid', 'name', 'reputation', 'logo'],
      },
      {
        model: Ticket,
        attributes: ['uuid', 'name', 'description', 'count', 'price', 'datetimeTo', 'datetimeFrom'],
        include: [
          {
            model: Event,
            attributes: ['uuid', 'name', 'description', 'coords', 'datetimeTo', 'datetimeFrom'],
          },
        ],
      },
    ],
  });

  req.status(200).send({ subscribers });
});

export {
  subscriberRouter,
};
