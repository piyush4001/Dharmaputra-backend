import { Schema, model, Document, Types } from "mongoose";

export interface IFamilyProfile extends Document {
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;

  userId: Types.ObjectId; // family member (logged-in user)

  seniorIds: Types.Array<Types.ObjectId>; // ✅ linked seniors (User IDs)

  relation: FamilyRelation;
  customRelation?: string;
  isPrimaryContact: boolean;
  isApproved: boolean;
  approvedAt?: Date;
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
    phone: {
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

export const FamilyProfile = model<IFamilyProfile>(
  "FamilyProfile",
  familyProfileSchema,
);
