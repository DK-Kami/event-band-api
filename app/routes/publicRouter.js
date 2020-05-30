import { publicEventRouter } from '../Event/publicEventRouter';
import { publicOrganizationRouter } from '../Organization';
import { anonimTagRouter } from '../Tag/anonimTagRouter';
import { passwordRouter } from '../User/password';
import { authRouter } from '../User';
import Router from '../Base/Router';

const router = new Router();

router.use('/organization', publicOrganizationRouter);
router.use('/tag', anonimTagRouter);
router.use('/', publicEventRouter);
router.use('/api', passwordRouter);
router.use('/', passwordRouter);
router.use('/', authRouter);

export default router;
