import { organizationRouter } from '../Organization';
import { organizerRouter } from '../Organizer';
import { profileRouter } from '../User/profile';
import { userRouter } from '../User';
import Router from '../Base/Router';
const router = new Router();

router.use('/organization', organizationRouter);
router.use('/organizer', organizerRouter);
router.use('/profile', profileRouter);
router.use('/user', userRouter);

export default router;
