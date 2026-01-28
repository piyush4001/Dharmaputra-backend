import { Schema, model, Types } from 'mongoose';

export enum LinkRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export enum relationType {
  SON = 'SON',
  DAUGHTER = 'DAUGHTER',
  BROTHER = 'BROTHER',
  SISTER = 'SISTER',
  HUSBAND = 'HUSBAND',
  WIFE = 'WIFE',
  GRANDCHILD = 'GRANDCHILD',
  FRIEND = 'FRIEND',
  HELPER = 'HELPER',
  SPOUSE = 'SPOUSE',
  OTHER = 'OTHER',
}
export enum LinkRequestType {
  FAMILY = 'FAMILY',
  HELPER = 'HELPER',
}

const seniorLinkRequestSchema = new Schema(
  {
    /* ---------------- TARGET SENIOR ---------------- */
    seniorId: {
      type: Types.ObjectId,
      ref: "User",

      required: true,
    },

    /* ================= FAMILY FLOW ================= */
    familyId: {
      type: Types.ObjectId,

      ref: 'User',
      required: function () {
        return this.requestType === LinkRequestType.FAMILY;
      },
    },

    familyName: {
      type: String,
      required: function () {
        return this.requestType === LinkRequestType.FAMILY;
      },
    },

    familyPhone: {
      type: String,
      required: function () {
        return this.requestType === LinkRequestType.FAMILY;
      },
    },

    relation: {
      type: String,
      required: function () {
        return this.requestType === LinkRequestType.FAMILY;
      },
    },

    /* ================= HELPER FLOW ================= */
    helperId: {
      type: Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.requestType === LinkRequestType.HELPER;
      },
    },

    helperName: {
      type: String,
      required: function () {
        return this.requestType === LinkRequestType.HELPER;
      },
    },

    helperPhone: {
      type: String,
      required: function () {
        return this.requestType === LinkRequestType.HELPER;
      },
    },

    /* ---------------- COMMON ---------------- */
    requestType: {
      type: String,
      enum: Object.values(LinkRequestType),
      default: LinkRequestType.FAMILY, // 🔥 IMPORTANT: keeps old code working
    },

    status: {
      type: String,
      enum: Object.values(LinkRequestStatus),
      default: LinkRequestStatus.PENDING,
    },
    relationType: {
      type: String,
      enum: Object.values(relationType),
    },
  },
  { timestamps: true },
);

export const SeniorLinkRequest = model(
  'SeniorLinkRequest',
  seniorLinkRequestSchema,
);
