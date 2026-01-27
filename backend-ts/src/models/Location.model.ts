// Location model
import { Schema, model, Document, Types } from "mongoose";

export interface ILocation extends Document {
  userId: Types.ObjectId;
 // panicId?: Types.ObjectId;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  createdAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // panicId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Panic",
    // },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
    },

    address: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Geo index (future: nearby helpers)
locationSchema.index({ latitude: 1, longitude: 1 });

export const Location = model<ILocation>("Location", locationSchema);
