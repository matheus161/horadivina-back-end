import { Router } from "express";
import emailInUse from "../middlewares/emailInUse";
import limitRequests from "../middlewares/limitRequests";
import validate from "../middlewares/validate";
import SessionController from "../controllers/SessionController";
import { authRules } from "../models/User";
import { adminAuthRules } from "../models/Admin";

const router = Router();

router.post(
  "/",
  limitRequests.heavily,
  validate(authRules),
  emailInUse,
  SessionController.auth
);

router.post(
  "/admin",
  limitRequests.heavily,
  validate(adminAuthRules),
  emailInUse,
  SessionController.authAdmin
);

export default { router, name: "/auth" };
