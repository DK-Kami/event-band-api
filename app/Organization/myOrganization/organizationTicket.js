import Router from '../../Base/Router';
import Ticket from '../../Ticket/Ticket';
import { getOrganization } from '../../../utils/myOrganization';

const organizationTicket = new Router();

/**
 * Путь для создания билета к события
 */
organizationTicket.post('/create', async (req, res) => {
  await getOrganization(req, res);

  Ticket.create(req.body, (message, ticket) => {
    if (message) {
      return res.status(400).send({ message });
    }

    return res.status(201).send({ ticket });
  });
});

/**
 * Редактирование билета по его uuid
 */
organizationTicket.put('/:uuid', async (req, res) => {
  await getOrganization(req, res);

  const { uuid } = req.params;
  const ticket = await Ticket.getByUUID(uuid);
  if (!ticket) {
    return res.status(404).send({
      message: 'ticket not found',
    });
  }

  Ticket.update(
    req.body,
    { uuid },
    async (message) => {
      if (message) {
        return res.status(400).send({ message });
      }

      const newTicket = await Ticket.getByUUID(uuid);
      return res.status(200).send({ ticket: newTicket });
    },
  );
});

/**
 * Удаление конкретного билета по его uuid
 */
organizationTicket.delete('/:uuid', async (req, res) => {
  await getOrganization(req, res);

  const { uuid } = req.params;
  const ticket = await Ticket.getByUUID(uuid);
  if (!ticket) {
    return res.status(404).send({
      message: 'ticket not found',
    });
  }

  Ticket.delete(uuid, message => {
    if (message) {
      return res.status(400).send({ message });
    }

    return res.status(200).send({
      message: 'all ok',
    });
  });
});

export {
  organizationTicket,
};
