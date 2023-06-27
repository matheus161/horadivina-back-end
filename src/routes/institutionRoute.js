import { Router } from 'express';
import InstitutionController from '../controllers/InstitutionController';
import { intitutionRules } from '../models/Institution';
import limitRequests from '../middlewares/limitRequests';
import verifyId from '../middlewares/verifyId';
import validate from '../middlewares/validate';
import verifyTokenAdmin from '../middlewares/verifyTokenAdmin';

const router = Router();

router.use(limitRequests.slightly);

router.use(verifyTokenAdmin);
router.post('/', validate(intitutionRules), InstitutionController.create);
router.put('/:id', verifyId, InstitutionController.update);
router.delete('/:id', verifyId, InstitutionController.remove);
router.get('/', InstitutionController.getAll);
router.get('/:id', InstitutionController.getById);

export default { router, name: '/institutions' };
