import Router from '../../Base/Router';
import { someOrganizationRouter } from './someOrganization';
import { organizationEvent } from './organizationEvent';
import { organizationTicket } from './organizationTicket';
import { organizationNews } from './organizationNews';
import { organizersRoter } from './organizers';

const myOrganizationRouter = new Router();

myOrganizationRouter.use(someOrganizationRouter);
myOrganizationRouter.use('/event', organizationEvent);
myOrganizationRouter.use('/ticket', organizationTicket);
myOrganizationRouter.use('/news', organizationNews);
myOrganizationRouter.use('/organizers', organizersRoter);

export {
  myOrganizationRouter,
};
