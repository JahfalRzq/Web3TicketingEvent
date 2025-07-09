import { Router } from "express";
import { fullSeeder } from "../../controller/seeder/testFullseeder";

const router = Router();
router.post("/fullSeeder", fullSeeder);

export default router;