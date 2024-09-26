import { Router } from "express";
import { getAnalyticsData } from "../controllers/analyticsController";

const router = Router();

router.get("/", getAnalyticsData);

export default router;
