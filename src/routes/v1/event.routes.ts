import { Router } from "express";
import { 
    createEventStub,
    getAllEventsStub,
    getEventByIdStub

} from "../../controller/Event/event.stub.controller";
import { checkJwt } from "../../utils/checkJwt";

const router = Router();

router.post("/createEventStub", [checkJwt,createEventStub]);
router.get("/get-all-events", getAllEventsStub); // ⬅️ Tambahkan ini
router.get("/get-events-by-id/:id", getEventByIdStub); // ⬅️ Tambahkan ini

export default router;
