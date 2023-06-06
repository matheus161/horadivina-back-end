import { Router } from "express";
import NewsController from "../controllers/NewsController";
import { newsRules } from "../models/News";
import limitRequests from "../middlewares/limitRequests";
import verifyId from "../middlewares/verifyId";
import validate from "../middlewares/validate";
import verifyTokenAdmin from "../middlewares/verifyTokenAdmin";

const router = Router();

router.use(limitRequests.slightly);

router.post("/", verifyTokenAdmin, validate(newsRules), NewsController.create);
router.get("/:id", verifyId, NewsController.getAll);
router.get("/:id", verifyId, NewsController.getById);
router.delete("/:id", verifyTokenAdmin, verifyId, NewsController.remove);

export default { router, name: "/news" };
