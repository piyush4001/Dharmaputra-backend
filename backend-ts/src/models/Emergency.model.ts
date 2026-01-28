
import { Schema, model, Document, Types } from 'mongoose';

export interface IEmergency extends Document {
  userId: Types.ObjectId;

  // Location info
  location?: {
    lat: number;
    lng: number;
  };

  // How emergency was triggered
  triggerType: 'BUTTON' | 'POWER' | 'FALL';

  // Emergency lifecycle
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED';

  // Response tracking
  respondedBy?: Types.ObjectId;
  responseStatus?: 'RESPONDED' | 'UNABLE_TO_REACH';
  respondedAt?: Date;

  // Timestamps
  triggeredAt: Date;
  resolvedAt?: Date;
}

const emergencySchema = new Schema<IEmergency>(
  {
    userId: {
      type: Schema.Types.ObjectId,

      ref: 'User',

      required: true,
    },

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    triggerType: {
      type: String,

      enum: ['BUTTON', 'POWER', 'FALL'],
      default: 'BUTTON',

    },

    status: {
      type: String,

      enum: ['ACTIVE', 'RESOLVED', 'CANCELLED'],
      default: 'ACTIVE',
    },

    respondedBy: {
      type: Schema.Types.ObjectId,

      ref: 'User',
    },

    responseStatus: {
      type: String,
      enum: ["RESPONDED", "UNABLE_TO_REACH"],

    },

    respondedAt: {
      type: Date,
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

export const Emergency = model<IEmergency>('Emergency', emergencySchema);

