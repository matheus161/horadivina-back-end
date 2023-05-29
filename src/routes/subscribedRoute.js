import { Router } from 'express';
import SubscribedController from '../controllers/SubscribedController';
import limitRequests from '../middlewares/limitRequests';
import verifyToken from '../middlewares/verifyToken';
import verifyId from '../middlewares/verifyId';

const router = Router();
router.use(limitRequests.slightly);
router.use(verifyToken);

router.put('/:id', verifyId, SubscribedController.subscribe);
router.put('/rem/:id', verifyId, SubscribedController.unsubscribe);
router.get('/:id', verifyId, SubscribedController.isSubscribed);

export default { router, name: '/subscription' };
