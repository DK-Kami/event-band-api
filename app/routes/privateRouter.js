import router from '../Base/Router';
import userRouter from '../User';

router.use('users', userRouter);

export default router;
