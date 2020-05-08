import { userRouter } from '../User';
import Router from '../Base/Router';
const router = new Router();

router.use('/users', userRouter);

export default router;
