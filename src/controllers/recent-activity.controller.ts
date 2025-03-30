import { Request, Response } from "express";
import InstructorResponse from "../models/instructor-response.model";
import Instructor from "../models/instructor.model"; // Import Instructor model
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const recentActivitiesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { name, email, availability, limit = 10 } = req.query;

      // Build query object dynamically
      const query: any = {};

      // Add availability filter if it exists
      if (availability) {
        query.availability = availability.toString(); // Convert to string to match schema type
      }

      // Fetch recent instructor responses with availability filter applied
      let recentResponses = await InstructorResponse.find(query)
        .limit(Number(limit)) // Limit the number of results
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
        .populate("instructorId"); // Populate the 'instructorId' field with the full Instructor document

      // Apply instructor filters after population if needed
      if (name || email) {
        recentResponses = recentResponses.filter((response) => {
          const instructor = response.instructorId as any;

          // Skip if instructorId is null or invalid
          if (!instructor) return false;

          // Apply name filter if it exists
          if (
            name &&
            (!instructor.Name ||
              !instructor.Name.toLowerCase().includes(
                String(name).toLowerCase()
              ))
          ) {
            return false;
          }

          // Apply email filter if it exists
          if (
            email &&
            (!instructor.Email ||
              !instructor.Email.toLowerCase().includes(
                String(email).toLowerCase()
              ))
          ) {
            return false;
          }

          return true;
        });
      }

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
