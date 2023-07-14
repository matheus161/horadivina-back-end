import { Router } from "express";
import UserController from "../controllers/UserController";
import limitRequests from "../middlewares/limitRequests";
import verifyToken from "../middlewares/verifyToken";
import verifyId from "../middlewares/verifyId";
// import validateUser from "../middlewares/validateUser";

const router = Router();

router.use(limitRequests.slightly);

router.get("/", UserController.getAll);
router.get("/:id", verifyId, UserController.getById);

router.use(verifyToken);

router.put("/change-pass", UserController.changePassword);
router.put("/", UserController.update);
router.delete("/", UserController.remove);

export default { router, name: "/user" };
