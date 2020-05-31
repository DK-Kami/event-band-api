import Router from '../../Base/Router';
import Organizer from '../../Organizer/Organizer';
import models from '../../../db/models';
import User from '../../User/User';
import { getOrganization } from '../../../utils/myOrganization';

const organizersRoter = new Router();
const {
  User: UserModel,
} = models;

/**
 * Получение всех организаторов организации
 */
organizersRoter.get('/all', async (req, res) => {
  await getOrganization(req, res);

  const {
    organization: {
      id: OrganizationId,
    },
  } = req.payload;

  const organizers = await Organizer.getAll({
    where: { OrganizationId },
    include: [
      { model: UserModel },
    ],
  });

  return res.status(200).send({ organizers });
});

/**
 * Отправка приглашения пользователю в команду организаторов
 */
organizersRoter.post('/request', async (req, res) => {
  await getOrganization(req, res);

  const { organization } = req.payload;
  const { email } = req.body;

  const user = await User.getOne({
    where: { email },
  });
  if (!user) {
    return res.status(404).send({
      message: 'user not found',
    });
  }
  const { id: OrganizationId } = organization;
  const { id: UserId } = user;

  Organizer.getOrCreate(
    { OrganizationId, UserId },
    { status: 0 },
    (message, organizerModel) => {
      if (message) {
        return res.status(400).send({ message });
      }
      const { isGet } = organizerModel;

      if (isGet) {
        return res.status(400).send({
          message: 'the request has already been sent',
        });
      }

      return res.status(201).send({
        mesage: 'all ok',
      });
    },
  );
});

export {
  organizersRoter,
};
