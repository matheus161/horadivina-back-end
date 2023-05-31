import { Router } from "express";
import AdminController from "../controllers/AdminController";
import limitRequests from "../middlewares/limitRequests";
//import verifyToken from "../middlewares/verifyToken";
import verifyId from "../middlewares/verifyId";
import validate from "../middlewares/validate";
import { adminRules } from "../models/Admin";
import adminEmailInUse from "../middlewares/adminEmailInUse";

const router = Router();

router.use(limitRequests.slightly);

router.post("/", validate(adminRules), adminEmailInUse, AdminController.create);
router.get("/", AdminController.getAll);
router.get("/:id", verifyId, AdminController.getById);
router.put(
  "/:id",
  validate(adminRules),
  adminEmailInUse,
  verifyId,
  AdminController.update
);
router.delete("/:id", verifyId, AdminController.remove);

export default { router, name: "/admin" };
