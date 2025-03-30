import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Instructor from "../models/instructor.model";
import { ApiError } from "../utils/ApiError";
import { parseCSV } from "../services/csv-parser";
import InstructorResponse from "../models/instructor-response.model";
import EmailTrack from "../models/email-track.model";

export const instructorHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const instructor = await Instructor.find()
        .limit(10)
        .sort({ createdAt: -1 });
      res.status(200).json(instructor);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json(new ApiError(500, err.message));
        return;
      }
      res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
  }
);

export const instructorResponse = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      //TODO: add filter

      const instructorResponse = await InstructorResponse.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
        .populate("instructorId"); // Populate the 'instructorId' field with the full Instructor document

      // Send response with status 200and the data
      res.status(200).json({
        instructorResponse,
      });
    } catch (error) {
      console.error("Error submitting availability:", error);
      res.status(500).json({ message: "Error submitting availability" });
    }
  }
);

export const instructorResponseHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, course, availability, name, instructorId } = req.body;
      if (!email || !course || !availability) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const instructor = await Instructor.findById(instructorId);

      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }

      instructor.status =
        availability === "yes" ? "available" : "not-available";
      instructor.save();

      const instructorResponse = new InstructorResponse({
        availability: availability,
        instructorId: instructorId,
      });
      await instructorResponse.save();
      res.send("submission successful!");

      let emailSend = await EmailTrack.findOne();
      if (!emailSend) {
        emailSend = new EmailTrack();
      }

      emailSend.emailRespond += 1;
      await emailSend.save();

      res.json({ message: "Availability submitted successfully!" });
    } catch (error) {
      console.error("Error submitting availability:", error);
      res.status(500).json({ message: "Error submitting availability" });
    }
  }
);

export const uploadCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const parsedInstructors = await parseCSV(req.file.path);
    console.log(parsedInstructors);
    const instructors = await Instructor.insertMany(parsedInstructors);

    res.status(200).json({ instructors });
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          500,
          error instanceof Error ? error.message : "Internal Server Error"
        )
      );
  }
};
