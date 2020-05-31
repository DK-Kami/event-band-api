import { myOrganizationRouter } from '../Organization/myOrganization';
import { organizationRouter } from '../Organization';
import { subscriberRouter } from '../Subscriber';
import { organizerRouter } from '../Organizer';
import { profileRouter } from '../User/profile';
import { chatRouter } from '../Chat/Chat';
import { ticketRouter } from '../Ticket';
import { eventRouter } from '../Event';
import { userRouter } from '../User';
import { newsRouter } from '../News';
import { tagRouter } from '../Tag/tagRouter';
import Router from '../Base/Router';

const router = new Router();

router.use('/my-organization', myOrganizationRouter);
router.use('/organization', organizationRouter);
router.use('/subscriber', subscriberRouter);
router.use('/organizer', organizerRouter);
router.use('/profile', profileRouter);
router.use('/ticket', ticketRouter);
router.use('/event', eventRouter);
router.use('/user', userRouter);
router.use('/news', newsRouter);
router.use('/chat', chatRouter);
router.use('/tag', tagRouter);

export default router;
