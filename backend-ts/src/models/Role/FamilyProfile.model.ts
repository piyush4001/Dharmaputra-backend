import { Schema, model, Document, Types } from "mongoose";

export interface IFamilyProfile extends Document {
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  userId: Types.ObjectId; // family member (logged-in user)
  seniorIds: Types.Array<FamilyRelation>; // linked senior
  relation: FamilyRelation;
  customRelation?: string; // if relation === OTHER
  isPrimaryContact: boolean;
}

export enum FamilyRelation {
  SON = "SON",
  DAUGHTER = "DAUGHTER",
  WIFE = "WIFE",
  HUSBAND = "HUSBAND",
  BROTHER = "BROTHER",
  SISTER = "SISTER",
  CAREGIVER = "CAREGIVER",
  OTHER = "OTHER",
}

const familyProfileSchema = new Schema<IFamilyProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one family profile per user
    },

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
    address: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    seniorIds: [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
],
    relation: {
      type: String,
      enum: Object.values(FamilyRelation),
      default: null,
    },


    customRelation: {
      type: String,
      trim: true,
    },

    isPrimaryContact: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const FamilyProfile = model<IFamilyProfile>(
  "FamilyProfile",
  familyProfileSchema,
);
