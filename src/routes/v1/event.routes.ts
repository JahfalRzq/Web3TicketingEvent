import { Router } from "express";
import { createEventStub } from "../../controller/Event/event.stub.controller";
import { checkJwt } from "../../utils/checkJwt";

const router = Router();

router.post("/createEventStub", [checkJwt,createEventStub]);

export default router;
