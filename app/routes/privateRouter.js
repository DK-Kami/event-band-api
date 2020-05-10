import { userRouter } from '../User';
import Router from '../Base/Router';
const router = new Router();

router.use('/user', userRouter);

export default router;
