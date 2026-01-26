// models/Role/HelperProfile.model.ts
import { Schema, model, Types } from "mongoose";

const helperProfileSchema = new Schema(
  {
    // 🔗 Linked user
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    /* ---------------- BASIC INFO ---------------- */
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    /* ---------------- ADDRESS (COMPOSITE) ---------------- */
    address: {
      houseNo: { type: String, trim: true },
      area: { type: String, trim: true, required: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true, required: true },
      pincode: {
        type: String,
        trim: true,
        match: /^[0-9]{6}$/,
        required: true,
      },
    },
    profileImage: {
      type: String,
      required: true, // or false if you want optional
    },

    /* ---------------- DOCUMENTS ---------------- */
    idCardImage: {
      type: String,
      default: null,
    },

    /* ---------------- EDUCATION ---------------- */
    education: {
      type: String,
      enum: [
        "NO_FORMAL_EDUCATION",
        "PRIMARY",
        "SECONDARY",
        "HIGHER_SECONDARY",
        "GRADUATE",
        "POST_GRADUATE",
      ],
      required: true,
    },

    /* ---------------- WORK LINKS ---------------- */
    linkedSeniorIds: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    /* ---------------- STATUS ---------------- */
    isActive: {
      type: Boolean,
      default: true,
    },
    availability: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "ON_CALL"],
      default: "FULL_TIME",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    /* ---------------- RATINGS ---------------- */
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

export const HelperProfile = model(
  "HelperProfile",
  helperProfileSchema
);
