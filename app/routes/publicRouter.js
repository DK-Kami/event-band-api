import { publicOrganizationRouter } from '../Organization';
import { passwordRouter } from '../User/password';
import { publicEventRouter } from '../Event';
import { anonimTagRouter } from '../Tag';
import { authRouter } from '../User';
import Router from '../Base/Router';
const router = new Router();

router.use('/organization', publicOrganizationRouter);
router.use('/tag', anonimTagRouter);
router.use('/', publicEventRouter);
router.use('/api', passwordRouter);
router.use('/', passwordRouter);
router.use('/', authRouter);

router.use('/ping', (req, res) => {
  console.log('-------------------------------------------------------');
  console.log('logs from ping');
  console.log('-------------------------------------------------------');
  console.log('req.headers', req.headers);
  console.log('req.headers.authorization', req.headers.authorization);
  console.log('-------------------------------------------------------');
});

export default router;
