import { Router } from "express";
import { emailHandler } from "../controllers/email.controller";
import { recentActivitiesHandler } from "../controllers/recent-activity.controller";

const router = Router();

router.get("/", recentActivitiesHandler);

export { router as recentActivitiesRoute };
