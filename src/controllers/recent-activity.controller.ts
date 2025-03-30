import { Request, Response } from "express";
import InstructorResponse from "../models/instructor-response.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const recentActivitiesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Fetch recent 10 instructor responses and populate the 'instructorId' field
      const recentResponses = await InstructorResponse.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
        .limit(10) // Limit to 10 records
        .populate("instructorId"); // Populate the 'instructorId' field with the full Instructor document

      // Send response with status 200 and the data
      res.status(200).json({
        recentResponses,
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json(new ApiError(500, err.message));
        return;
      }
      res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
  }
);
