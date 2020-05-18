import Router from '../Base/Router';
import Organizer from '../Organizer/Organizer';
import Organization from './Organization';
import User from '../User/User';
import Subscriber from '../Subscriber/Subscriber';

const organizationRouter = new Router();

/**
 * [DEBUG] Получение всех организаций
 */
organizationRouter.get('/all', async (req, res) => {
  const organizations = await Organization.getAll();
  return res.status(200).send({ organizations });
});
/**
 *  Получение конкретной организации по uuid
 */
organizationRouter.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;
  const organization = await Organization.getByUUID(uuid);
  res.status(200).send({ organization });
});

/**
 * Подписка на организацию
 */
organizationRouter.get('/subscribe/:uuid', async (req, res) => {
  const { uuid: OrganizationUUID } = req.params;
  const { userUUID } = req.payload;

  const { id: UserId } = await User.getByUUID(userUUID);
  const { id: OrganizationId } = await Organization.getByUUID(OrganizationUUID);

  try {
    const {
      model: subscription,
      isCreate,
    } = await Subscriber.getOrCreate({ OrganizationId, UserId }, { status: 1 });

    if (isCreate || !subscription.status) {
      subscription.status = 1;
      subscription.save();

      res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      res.status(400).send({
        message: 'email address is already in this organization',
      });
    }
  }
  catch(message) {
    console.error(message);
    res.status(400).send({ message });
  }
});
/**
 * Подписка на организации
 */
organizationRouter.get('/unsubscribe/:uuid', async (req, res) => {
  const { uuid: OrganizationUUID } = req.params;
  const { userUUID } = req.payload;

  const { id: UserId } = await User.getByUUID(userUUID);
  const { id: OrganizationId } = await Organization.getByUUID(OrganizationUUID);

  try {
    const subscription = await Subscriber.getOne({
      where: { OrganizationId, UserId },
    });

    if (subscription.status) {
      subscription.status = 0;
      subscription.save();

      res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      res.status(400).send({
        message: 'you are already out of this organization',
      });
    }
  }
  catch(message) {
    console.error(message);
    res.status(400).send({ message });
  }
});

/**
 * Путь для создания новой организации
 */
organizationRouter.post('/create', async (req, res) => {
  const {
    description,
    name,
    logo,
  } = req.body;
  const { uuid } = req.payload

  try {
    const user = await User.getByUUID(uuid);
    const organization = await Organization.create({
      reputation: 0,
      description,
      name,
      logo,
    });

    const organizer = await Organizer.create({
      OrganizationId: organization.id,
      UserId: user.id,
      status: 1,
    });

    res.status(201).send({ organization });
  }
  catch(message) {
    console.log(message);
    res.status(400).send({ message });
  }
});

export {
  organizationRouter,
};
