import mongoose, { Model, Schema } from "mongoose";
import { IInstructor } from "../interfaces/instructor";

// Define Mongoose Schema
const InstructorSchema: Schema<IInstructor> = new Schema(
  {
    Offering: { type: String, required: false },
    Campus: { type: String, required: false },
    Delivery: { type: String, required: false },
    Name: { type: String, required: false },
    Email: { type: String, required: false, unique: false },
    Courses: { type: String, required: false },
    status: { type: String, default: "pending" },
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt
);

// Define and export the Mongoose model
const Instructor: Model<IInstructor> = mongoose.model<IInstructor>(
  "Instructor",
  InstructorSchema
);
export default Instructor;
