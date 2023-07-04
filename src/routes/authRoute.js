import { Router } from 'express';
import emailInUse from '../middlewares/emailInUse';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import SessionController from '../controllers/SessionController';
import { authRules } from '../models/User';
import { adminAuthRules } from '../models/Admin';

const router = Router();

router.post(
    '/',
    limitRequests.slightly,
    validate(authRules),
    emailInUse,
    SessionController.auth
);

router.post(
    '/refresh-token',
    limitRequests.slightly,
    SessionController.refreshTokenUser
);

router.post(
    '/admin',
    limitRequests.slightly,
    validate(adminAuthRules),
    emailInUse,
    SessionController.authAdmin
);

export default { router, name: '/auth' };
