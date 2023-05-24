import { Router } from "express";
import ReligionController from "../controllers/ReligionController";
import limitRequests from "../middlewares/limitRequests";
import verifyId from "../middlewares/verifyId";

const router = Router();

router.use(limitRequests.slightly);

router.post("/", ReligionController.create);
router.put("/:id", verifyId, ReligionController.update);
router.get("/", ReligionController.getAll);
router.delete("/:id", verifyId, ReligionController.remove);

export default { router, name: "/religion" };
