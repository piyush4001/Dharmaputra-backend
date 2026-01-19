import { Schema, model, Types } from "mongoose";

const seniorProfileSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    emergencyContact: {
      type: String,
    },

    medicalInfo: {
      type: String,
    },
  },
  { timestamps: true },
);

export const SeniorProfile = model(
  "SeniorProfile",
  seniorProfileSchema,
);
