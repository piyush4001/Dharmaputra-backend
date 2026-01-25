import { Schema, model, Types } from "mongoose";

const seniorProfileSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
     // required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
    familyIds: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    helperIds: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const SeniorProfile = model(
  "SeniorProfile",
  seniorProfileSchema,
);
