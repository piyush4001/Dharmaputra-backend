// User model
import { Schema, model, Types, Document } from "mongoose";

export enum UserRole {
  SENIOR = "SENIOR",
  CHILD = "CHILD",
  HELPER = "HELPER",
  FAMILY = "FAMILY",
}

export interface IUser extends Document {
  name?: string;
  phone: string;
  role: UserRole | null;
  
  emergencyContacts: Types.ObjectId[];
  devices: Types.ObjectId[];
  isActive: boolean;
  lastLogin?: Date;
  pushTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

   role: {
  type: String,
  enum: Object.values(UserRole),
  default: null,
},


    emergencyContacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Device",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
    pushTokens: {
  type: [String],
  default: [],
},

  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
