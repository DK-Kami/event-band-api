import Router from "../../Base/Router";
import Organization from "../Organization";
import User from "../../User/User";
import { someOrganizationRouter } from "./someOrganization";
import { organizationEvent } from "./organizationEvent";
import { organizationTicket } from "./organizationTicket";

const myOrganizationRouter = new Router();

/**
 * Middleware, обеспечивающий безопасность путей организации,
 * путём проверки, передаваемого токена и получения организации
 */
myOrganizationRouter.use(async (req, res, next) => {
  const {
    organizationUUID,
    userUUID,
  } = req.payload;

  if (!organizationUUID) {
    return res.status(403).send({
      message: 'Permission denied! You have no power here, servant of Mordor.',
    });
  }

  const organization = await Organization.getByUUID(organizationUUID);
  const user = await User.getByUUID(userUUID);

  req.payload.organization = organization;
  req.payload.user = user;
  return next();
});

myOrganizationRouter.use(someOrganizationRouter);
myOrganizationRouter.use('/event', organizationEvent);
myOrganizationRouter.use('/ticket', organizationTicket);

export {
  myOrganizationRouter,
};
