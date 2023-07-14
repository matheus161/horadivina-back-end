import { Router } from "express";
import FavoritedController from "../controllers/FavoritedController";
import limitRequests from "../middlewares/limitRequests";
import verifyToken from "../middlewares/verifyToken";
import verifyId from "../middlewares/verifyId";

const router = Router();
router.use(limitRequests.slightly);
router.use(verifyToken);

router.put("/:id", verifyId, FavoritedController.addFavorites);
router.put("/rem/:id", verifyId, FavoritedController.remFavorites);

export default { router, name: "/favorited" };
