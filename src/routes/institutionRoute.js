import { Router } from 'express';
import InstitutionController from '../controllers/InstitutionController';
import { intitutionRules } from '../models/Institution';
import limitRequests from '../middlewares/limitRequests';
import verifyId from '../middlewares/verifyId';
import validate from '../middlewares/validate';

const router = Router();

router.use(limitRequests.slightly);

// TODO: Colocar validação para apenas Admin
router.post('/', validate(intitutionRules), InstitutionController.create);
router.put('/:id', verifyId, InstitutionController.update);
router.delete('/:id', verifyId, InstitutionController.remove);
router.get('/', InstitutionController.getAll);
router.get('/:id', InstitutionController.getById);

export default { router, name: '/institutions' };
