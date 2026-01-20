import { Schema, model, Document, Types } from "mongoose";

export interface IEmergency extends Document {
  userId: Types.ObjectId;
  location?: {
    lat: number;
    lng: number;
  };
  triggerType: "BUTTON" | "POWER" | "FALL";
  status: "ACTIVE" | "RESOLVED" | "CANCELLED";
  triggeredAt: Date;
  resolvedAt?: Date;
}

const emergencySchema = new Schema<IEmergency>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },
    triggerType: {
  type: String,
  enum: ["BUTTON", "POWER", "FALL"],
  default: "BUTTON",
},

    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED", "CANCELLED"],
      default: "ACTIVE",
    },

    triggeredAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Emergency = model<IEmergency>("Emergency", emergencySchema);
