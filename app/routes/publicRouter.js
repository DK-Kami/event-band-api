import { publicEventRouter } from '../Event';
import { passwordRouter } from '../User/profile';
import { authRouter } from '../User';
import Router from '../Base/Router';
const router = new Router();

router.use('/', publicEventRouter);
router.use('/api', passwordRouter);
router.use('/', passwordRouter);
router.use('/', authRouter);

export default router;
