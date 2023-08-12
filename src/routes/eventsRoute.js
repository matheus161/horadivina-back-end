import { Router } from "express";
import EventsController from "../controllers/EventsController";
import { eventsRules } from "../models/Events";
import limitRequests from "../middlewares/limitRequests";
import verifyId from "../middlewares/verifyId";
import validate from "../middlewares/validate";
import verifyTokenAdmin from "../middlewares/verifyTokenAdmin";

const router = Router();

router.use(limitRequests.slightly);

router.post(
  "/",
  verifyTokenAdmin,
  validate(eventsRules),
  EventsController.create
);
router.put("/:id", verifyTokenAdmin, verifyId, EventsController.update);
router.get("/:id", verifyId, EventsController.getAll);
router.delete("/:id", verifyTokenAdmin, verifyId, EventsController.remove);

export default { router, name: "/events" };
