import { Schema, model, Document, Types } from "mongoose";

export interface IHelperProfile extends Document {
  userId: Types.ObjectId;
  skills?: string[];
  availability?: boolean;
  area?: string;
}

const helperProfileSchema = new Schema<IHelperProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: [String],
    availability: Boolean,
    area: String,
  },
  { timestamps: true },
);

export const HelperProfile = model<IHelperProfile>(
  "HelperProfile",
  helperProfileSchema,
);
