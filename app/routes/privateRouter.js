import { organizationRouter } from '../Organization';
import { organizerRouter } from '../Organizer';
import { profileRouter } from '../User/profile';
import { eventRouter } from '../Event';
import { userRouter } from '../User';
import { tagRouter } from '../Tag';
import Router from '../Base/Router';
const router = new Router();

router.use('/organization', organizationRouter);
router.use('/organizer', organizerRouter);
router.use('/profile', profileRouter);
router.use('/event', eventRouter);
router.use('/user', userRouter);
router.use('/tag', tagRouter);

export default router;
