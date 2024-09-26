import { Router } from "express";
import { adminLogin } from "../controllers/loginController";

const router = Router();

router.post("/", adminLogin);

export default router;
