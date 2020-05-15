import Router from "../Base/Router";
import Subscriber from "./Subscriber";
import models from '../../db/models';

const subscriberRouter = new Router();

const {
  Organization: OrganizationModel,
  Ticket: TicketModel,
  Event: EventModel,
  User: UserModel,
} = models;

subscriberRouter.get('/all', async (res, req) => {
  const subscribers = await Subscriber.getAll({
    attributes: ['uuid'],
    include: [
      {
        model: OrganizationModel,
        attributes: ['uuid', 'name', 'reputation', 'logo'],
      },
      {
        model: UserModel,
        attributes: ['uuid', 'name', 'surname', 'email'],
      },
      {
        model: TicketModel,
        attributes: ['uuid', 'name', 'description', 'count', 'price', 'datetimeTo', 'datetimeFrom'],
        include: [
          {
            model: EventModel,
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
