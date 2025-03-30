import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Instructor from "../models/instructor.model";
import { sendBatchAMPEmails } from "../utils/batch-email";
import { ApiError } from "../utils/ApiError";
import EmailTrack from "../models/email-track.model";

export const emailHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const instructors = body.instructors;

      if (instructors.length == 0)
        return res.status(404).json({ message: "No instructors found" });
      await sendBatchAMPEmails(instructors);
      let emailSend = await EmailTrack.findOne();

      if (!emailSend) {
        emailSend = new EmailTrack();
      }

      emailSend.emailSent += instructors.length;

      await emailSend.save();
      res.status(200).json({ message: "Batch emails sent successfully!" });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json(new ApiError(500, err.message));
        return;
      }
      res.status(500).json(new ApiError(500, "Internal Server Error"));
      console.log(err);
    }
  }
);

export const emailTrackHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const emailTrack = await EmailTrack.findOne();

      res.status(200).json({ emailTrack });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json(new ApiError(500, err.message));
        return;
      }
      res.status(500).json(new ApiError(500, "Internal Server Error"));
      console.log(err);
    }
  }
);
