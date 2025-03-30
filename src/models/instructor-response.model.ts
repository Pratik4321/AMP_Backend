import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the FormData document
interface IInstructorResponse extends Document {
  availability: string;
  instructorId: mongoose.Types.ObjectId;
}

// Define the schema for FormData
const instructorResponseSchema = new Schema<IInstructorResponse>(
  {
    availability: {
      type: String,
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Instructor", // Reference to Instructor model
    },
  },
  { timestamps: true }
);

// Create and export the FormData model
const InstructorResponse = mongoose.model<IInstructorResponse>(
  "InstructorResponse",
  instructorResponseSchema
);

export default InstructorResponse;
