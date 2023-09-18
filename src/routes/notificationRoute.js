import { Router } from "express";
import NotificationController from "../controllers/NotificationController";
import verifyTokenAdmin from "../middlewares/verifyTokenAdmin";

const router = Router();
router.use(verifyTokenAdmin);

router.post("/", NotificationController.notify);

export default { router, name: "/notify" };
