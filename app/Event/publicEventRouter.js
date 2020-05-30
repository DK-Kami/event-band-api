import Router from '../Base/Router';
import Event from './Event';
import User from '../User/User';
import Ticket from '../Ticket/Ticket';
import Subscriber from '../Subscriber/Subscriber';

const publicEventRouter = new Router();

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
        return res.status(404).send({
          message: 'ticket not found',
        });
      }

      const { id: TicketId } = ticket;
      const { id: UserId } = user;
      Subscriber.getOrCreate({ TicketId, UserId }, { status: 1 }, (subMessage, subscriber) => {
        if (subMessage) {
          return res.status(400).send({ subMessage });
        }

        const {
          model: subscription,
          isCreate,
        } = subscriber;

        if (isCreate || !subscription.status) {
          subscription.status = 1;
          subscription.save();

          return res.status(201).send({
            message: 'all ok',
          });
        }

        return res.status(400).send({
          message: 'email address is already registered at the event',
        });
      });
    },
  );
});

export {
  publicEventRouter,
};
