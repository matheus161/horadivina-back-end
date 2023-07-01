import { Router } from 'express';
import ReligionController from '../controllers/ReligionController';
import limitRequests from '../middlewares/limitRequests';
import verifyId from '../middlewares/verifyId';
import verifyTokenAdmin from '../middlewares/verifyTokenAdmin';

const router = Router();

router.use(limitRequests.slightly);

router.post('/', verifyTokenAdmin, ReligionController.create);
router.put('/:id', verifyId, ReligionController.update);
router.get('/', ReligionController.getAll);
router.delete('/:id', verifyTokenAdmin, verifyId, ReligionController.remove);

export default { router, name: '/religion' };
