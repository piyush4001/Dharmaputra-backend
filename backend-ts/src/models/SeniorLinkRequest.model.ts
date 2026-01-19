import { Schema, model, Types } from "mongoose";

export enum LinkRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

const seniorLinkRequestSchema = new Schema(
  {
    seniorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    familyId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    familyName: {
      type: String,
      required: true,
    },
    familyPhone: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(LinkRequestStatus),
      default: LinkRequestStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const SeniorLinkRequest = model(
  "SeniorLinkRequest",
  seniorLinkRequestSchema
);
