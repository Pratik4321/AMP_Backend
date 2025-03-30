import { Router } from "express";
import { emailTrackHandler } from "../controllers/email.controller";

const router = Router();

router.get("/", emailTrackHandler);

export { router as emailTrackRoute };
