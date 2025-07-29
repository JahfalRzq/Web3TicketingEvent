import { Router } from "express";
import { mintTicketStub } from "../../controller/Event/ticket.stub.controller";

const router = Router();

router.post("/ticket/mint", mintTicketStub);

export default router;
