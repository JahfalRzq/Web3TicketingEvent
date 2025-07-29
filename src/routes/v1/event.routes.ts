import { Router } from "express";
import { createEventStub } from "../../controller/Event/event.stub.controller";

const router = Router();

router.post("/event", createEventStub);

export default router;
