import { Router } from "express";
import { createEventStub,getAllEvents } from "../../controller/Event/event.stub.controller";
import { checkJwt } from "../../utils/checkJwt";

const router = Router();

router.post("/createEventStub", [checkJwt,createEventStub]);
router.get("/get-all-events", getAllEvents); // ⬅️ Tambahkan ini

export default router;
