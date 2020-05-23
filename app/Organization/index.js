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
  if (!organization) {
    return res.status(404).send({
      message: 'organization not found',
    });
  }

  return res.status(200).send({ organization });
});

/**
 * Подписка на организацию
 */
organizationRouter.get('/subscribe/:uuid', async (req, res) => {
  const { uuid: OrganizationUUID } = req.params;
  const { userUUID } = req.payload;

  const organization = await Organization.getByUUID(OrganizationUUID);
  if (!organization) {
    return res.status(404).send({
      message: 'organization not found',
    });
  }

  const { id: OrganizationId } = organization;
  const { id: UserId } = await User.getByUUID(userUUID);

  Subscriber.getOrCreate({ OrganizationId, UserId }, { status: 1 }, (message, subscriptionData) => {
    if (message) {
      return res.status(400).send({ message });
    }
    const {
      model: subscription,
      isCreate,
    } = subscriptionData;

    if (isCreate || !subscription.status) {
      subscription.status = 1;
      subscription.save();
  
      return res.status(201).send({
        message: 'nice dick, awesome balls',
        subscription,
      });
    }
    else {
      return res.status(400).send({
        message: 'email address is already in this organization',
      });
    }
  });
});
/**
 * Подписка на организации
 */
organizationRouter.get('/unsubscribe/:uuid', async (req, res) => {
  const { uuid: OrganizationUUID } = req.params;
  const { userUUID } = req.payload;

  const organization = await Organization.getByUUID(OrganizationUUID);
  if (!organization) {
    res.send(404).send({
      message: 'organization not found',
    });
  }

  const { id: OrganizationId } = organization;
  const { id: UserId } = await User.getByUUID(userUUID);

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
  const { uuid } = req.payload;

  const user = await User.getByUUID(uuid);
  const createData = {
    reputation: 0,
    description,
    name,
    logo,
  };

  Organization.create(createData, (message, organization) => {
    if (message) {
      return res.status(400).send({ message });
    }

    Organizer.create({
      OrganizationId: organization.id,
      UserId: user.id,
      status: 1,
    }, (message) => {
      if (message) {
        return res.status(400).send({ message });
      }

      return res.status(201).send({ organization });
    });
  });
});

export {
  organizationRouter,
};
