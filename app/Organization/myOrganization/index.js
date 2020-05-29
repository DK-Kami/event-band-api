import Router from "../../Base/Router";
import Organization from "../Organization";
import User from "../../User/User";
import { someOrganizationRouter } from "./someOrganization";
import { organizationEvent } from "./organizationEvent";
import { organizationTicket } from "./organizationTicket";
import { organizationNews } from "./organizationNews";
import { organizersRoter } from "./organizers";
import auth from '../../routes/auth';

const myOrganizationRouter = new Router();

/**
 * Middleware, обеспечивающий безопасность путей организации,
 * путём проверки, передаваемого токена и получения организации
 */
myOrganizationRouter.use(auth.required, async (req, res, next) => {
  console.log('req.headers', req.headers);
  console.log('req.payload', req.payload);
 
  if (!req.payload) {
    return res.status(400).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  const {
    organizationUUID,
    userUUID,
  } = req.payload;

  console.log('are u clown?', organizationUUID, userUUID);
  if (!organizationUUID) {
    return res.status(400).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  // const organization = await Organization.getByUUID(organizationUUID);
  const organization = await Organization.getByUUID('989713f3-2f0b-4a14-b863-d98b5c00f94e');
  const user = await User.getByUUID(userUUID);

  req.payload.organization = organization;
  req.payload.user = user;
  return next();
});

myOrganizationRouter.use(someOrganizationRouter);
myOrganizationRouter.use('/event', organizationEvent);
myOrganizationRouter.use('/ticket', organizationTicket);
myOrganizationRouter.use('/news', organizationNews);
myOrganizationRouter.use('/organizers', organizersRoter);

export {
  myOrganizationRouter,
};
