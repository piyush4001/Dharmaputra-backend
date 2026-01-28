import { Schema, model, Types } from "mongoose";

const feedbackSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["SENIOR", "FAMILY", "HELPER"],
      required: true,
    },
    type: {
      type: String,
      enum: ["TEXT", "AUDIO", "VIDEO"],
      required: true,
    },
    text: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    mediaPublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export default model("Feedback", feedbackSchema);
