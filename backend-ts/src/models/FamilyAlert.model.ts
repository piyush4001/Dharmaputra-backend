// models/FamilyAlert.model.ts
import { Schema, model, Types } from "mongoose";

const familyAlertSchema = new Schema(
  {
    familyId: { type: Types.ObjectId, ref: "User", required: true },
    seniorId: { type: Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["APPROVED", "REJECTED"],
      required: true,
    },
    isDeletedByFamily: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const FamilyAlert = model("FamilyAlert", familyAlertSchema);
