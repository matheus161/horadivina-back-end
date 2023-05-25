import { Router } from 'express';
import NewsController from '../controllers/NewsController';
import { newsRules } from '../models/News';
import limitRequests from '../middlewares/limitRequests';
import verifyId from '../middlewares/verifyId';
import validate from '../middlewares/validate';

const router = Router();

router.use(limitRequests.slightly);

router.post('/', validate(newsRules), NewsController.create);
router.get('/', NewsController.getAll);
router.get('/:id', verifyId, NewsController.getById);
router.delete('/:id', verifyId, NewsController.remove);

export default { router, name: '/news' };
