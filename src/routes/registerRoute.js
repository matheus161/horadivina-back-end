import { Router } from "express";
import UserController from "../controllers/UserController";
import emailInUse from "../middlewares/emailInUse";
import limitRequests from "../middlewares/limitRequests";
import validate from "../middlewares/validate";
import { userRules } from "../models/User";

const router = Router();

router.post(
  "/",
  validate(userRules),
  limitRequests.heavily,
  emailInUse,
  UserController.create
);

export default { router, name: "/register" };
