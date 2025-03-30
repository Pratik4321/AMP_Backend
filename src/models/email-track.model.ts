import mongoose, { Model, Schema } from "mongoose";
import { IEmailTrack } from "../interfaces/email";

// Define Mongoose Schema
const EmailTrackSchema: Schema<IEmailTrack> = new Schema(
  {
    emailSent: { type: Number, default: 0 },
    emailRespond: { type: Number, default: 0 },
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt
);

// Define and export the Mongoose model
const EmailTrack: Model<IEmailTrack> = mongoose.model<IEmailTrack>(
  "EmailTrack",
  EmailTrackSchema
);

export default EmailTrack;
