import { Router } from "express";
import { emailHandler } from "../controllers/email.controller";

const router = Router();

router.post("/", emailHandler);

export { router as emailRoute };
