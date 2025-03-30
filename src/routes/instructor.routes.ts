import { Request, Response, Router } from "express";
import {
  instructorHandler,
  instructorResponse,
  instructorResponseHandler,
  uploadCSV,
} from "../controllers/instructor.controller";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", instructorHandler);
router.get("/instructor-response", instructorResponse);

router.post("/upload", upload.single("file"), uploadCSV);
router.post("/submit-availability", instructorResponseHandler);

export { router as instructorRoute };
