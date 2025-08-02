import { Router } from "express";
import { createEventStub } from "../../controller/Event/event.stub.controller";

const router = Router();

router.post("/createEventStub", createEventStub);

export default router;
