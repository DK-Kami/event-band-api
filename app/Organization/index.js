import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Router from '../Base/Router';
import Organizer from '../Organizer/Organizer';
import Organization from './Organization';
import User from '../User/User';
import Subscriber from '../Subscriber/Subscriber';

const appDir = path.dirname(require.main.filename);
const imageFolder = [appDir, 'public', 'organizations'].join('/');
const upload = multer({
  dest: imageFolder,
});

const publicOrganizationRouter = new Router();
const organizationRouter = new Router();


/**
 * [DEBUG] Получение всех организаций
 */
organizationRouter.get('/all', async (req, res) => {
  const organizations = await Organization.getAll();
  return res.status(200).send({ organizations });
});
/**
 * Путь для создания новой организации
 */
organizationRouter.post('/create', upload.single('logo'), async (req, res) => {
  const {
    description,
    name = '',
  } = req.body;
  const { uuid } = req.payload;
  const logo = req.file;
  const user = await User.getByUUID(uuid);

  const oldpath = logo.path;
  const type = logo.mimetype.split('/')[1];
  const imageName = `${name.split(' ').join('_').toLowerCase()}.${type}`;
  const newPath = [imageFolder, imageName].join('/');

  fs.rename(oldpath, newPath, message => {
    if (message) {
      return res.status(400).send({ message });
    }
    const createData = {
      logo: imageName,
      reputation: 1,
      description,
      name,
    };

    Organization.create(createData, (orgMessage, organization) => {
      if (orgMessage) {
        return res.status(400).send({ message: orgMessage });
      }

      Organizer.create({
        OrganizationId: organization.id,
        UserId: user.id,
        status: 1,
      }, (organizerMessage) => {
        if (organizerMessage) {
          return res.status(400).send({
            message: organizerMessage,
          });
        }

        return res.status(201).send({ organization });
      });
    });
  });
});

/**
 *  Получение конкретной организации по uuid для неавторизованных пользователей
 */
publicOrganizationRouter.get('/:uuid', Organization.getOrganizationByUUID);
/**
 *  Получение конкретной организации по uuid для авторизованных пользователей
 */
organizationRouter.get('/:uuid', Organization.getOrganizationByUUID);

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
        message: 'all ok',
      });
    }

    return res.status(400).send({
      message: 'email address is already in this organization',
    });
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

      return res.status(201).send({
        message: 'all ok',
      });
    }
    return res.status(400).send({
      message: 'you are already out of this organization',
    });
  } catch (message) {
    console.error(message);
    return res.status(400).send({ message });
  }
});

/**
 * Путь для регистрации под организацию
 */
organizationRouter.get('/login/:organizationUUID', async (req, res) => {
  const { organizationUUID } = req.params;
  const { userUUID } = req.payload;

  const organization = await Organization.getByUUID(organizationUUID);
  if (!organization) {
    return res.status(404).send({
      message: 'Organization not found',
    });
  }
  const user = await User.getByUUID(userUUID);

  const organizer = await Organizer.getOne({
    where: {
      OrganizationId: organization.id,
      UserId: user.id,
    },
  });
  if (!organizer) {
    return res.status(403).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  const organizationToken = await Organization.loginAsOrganization({
    organizationUUID,
    userUUID,
  });
  return res.status(200).send({ organizationToken });
});

export {
  publicOrganizationRouter,
  organizationRouter,
};
