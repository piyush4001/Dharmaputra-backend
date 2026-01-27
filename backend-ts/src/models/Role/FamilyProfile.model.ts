// import { Schema, model, Document, Types } from "mongoose";

// export interface IFamilyProfile extends Document {
//   firstName: string;
//   lastName: string;
//   address?: string;
//   phone?: string;
//   profileImage: string;
//   userId: Types.ObjectId; // family member (logged-in user)

//   seniorIds: Types.Array<Types.ObjectId>; // ✅ linked seniors (User IDs)

//   isPrimaryContact: boolean;
//   isApproved: boolean;
//   approvedAt?: Date;
//   idCardImage?: string;
//   helperIds: Types.Array<Types.ObjectId>; // 🆕 linked helpers (Helper IDs)
// }

// const familyProfileSchema = new Schema<IFamilyProfile>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true, // one family profile per user
//     },

//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     address: {
//       type: String,
//       trim: true,
//     },
//     profileImage: {
//       type: String,
//       required: true, // or false if you want optional
//     },

//     idCardImage: {
//       type: String,
//       default: null,
//     },

//     phone: {
//       type: String,
//       trim: true,
//     },
//     seniorIds: [
//   {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
// ],
//     isPrimaryContact: {
//       type: Boolean,
//       default: false,
//     },
//     isApproved: {
//       type: Boolean,
//       default: false,
//     },
//     approvedAt: {
//       type: Date,
//     },
//     helperIds: [
//   {
//     type: Schema.Types.ObjectId,
//     ref: "Helper"
//   }
// ]

//   },
//   { timestamps: true },
// );

// export const FamilyProfile = model<IFamilyProfile>(
//   'FamilyProfile',
//   familyProfileSchema,
// );
import { Schema, model, Document, Types } from "mongoose";

/**
 * Address sub-schema
 * Supports auto-fill from current location + manual edit
 */
const addressSchema = new Schema(
  {
    fullAddress: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
    postalCode: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: undefined,
      },
    },
  },
  { _id: false }
);

export interface IFamilyProfile extends Document {
  firstName: string;
  lastName: string;

  address?: {
    fullAddress?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    location?: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };

  phone?: string;
  profileImage: string;
  idCardImage?: string;

  userId: Types.ObjectId; // family member (logged-in user)
  seniorIds: Types.Array<Types.ObjectId>; // linked seniors (User IDs)
  isPrimaryContact: boolean;
  isApproved: boolean;
  approvedAt?: Date;
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
      type: addressSchema,
      default: undefined,
    },

    phone: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      required: true,
    },

    idCardImage: {
      type: String,
      default: null,
    },

    seniorIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
  { timestamps: true }
);

// 🔍 Geo index for future location-based queries
familyProfileSchema.index({ "address.location": "2dsphere" });

export const FamilyProfile = model<IFamilyProfile>(
  "FamilyProfile",
  familyProfileSchema
);
