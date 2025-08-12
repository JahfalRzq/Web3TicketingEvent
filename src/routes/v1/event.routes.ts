import { Router } from "express";
import { 
    createEventStub,
    getAllEventsStub,
    getEventByIdStub,
    updateEventStub,
    softDeleteEventStub

} from "../../controller/Event/event.stub.controller";
import { checkJwt } from "../../utils/checkJwt";

const router = Router();

router.post("/createEventStub", [checkJwt,createEventStub]);
router.get("/get-all-events", getAllEventsStub); // ⬅️ Tambahkan ini
router.get("/get-events-by-id/:id", getEventByIdStub); // ⬅️ Tambahkan ini
router.patch("/update-events/:id", updateEventStub); // ⬅️ Tambahkan ini
router.delete("/delete-events/:id", softDeleteEventStub); // ⬅️ Tambahkan ini

export default router;
