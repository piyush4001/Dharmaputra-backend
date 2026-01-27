// // models/Role/HelperProfile.model.ts
// import { Schema, model, Types } from "mongoose";

// const helperProfileSchema = new Schema(
//   {
//     // 🔗 Linked user
//     user: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     /* ---------------- BASIC INFO ---------------- */
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

//     age: {
//       type: Number,
//       required: true,
//       min: 18,
//     },

//     /* ---------------- ADDRESS (COMPOSITE) ---------------- */
//     address: {
//       houseNo: { type: String, trim: true },
//       area: { type: String, trim: true, required: true },
//       city: { type: String, trim: true, required: true },
//       state: { type: String, trim: true, required: true },
//       pincode: {
//         type: String,
//         trim: true,
//         match: /^[0-9]{6}$/,
//         required: true,
//       },
//     },
//     profileImage: {
//       type: String,
//       required: true, // or false if you want optional
//     },

//     /* ---------------- DOCUMENTS ---------------- */
//     idCardImage: {
//       type: String,
//       default: null,
//     },

//     /* ---------------- EDUCATION ---------------- */
//     education: {
//       type: String,
//       enum: [
//         "NO_FORMAL_EDUCATION",
//         "PRIMARY",
//         "SECONDARY",
//         "HIGHER_SECONDARY",
//         "GRADUATE",
//         "POST_GRADUATE",
//       ],
//       required: true,
//     },

//     /* ---------------- WORK LINKS ---------------- */
//     linkedSeniorIds: [
//       {
//         type: Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     /* ---------------- STATUS ---------------- */
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     availability: {
//       type: String,
//       enum: ["FULL_TIME", "PART_TIME", "ON_CALL"],
//       default: "FULL_TIME",
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     /* ---------------- RATINGS ---------------- */
//     rating: {
//       average: {
//         type: Number,
//         default: 0,
//         min: 0,
//         max: 5,
//       },
//       count: {
//         type: Number,
//         default: 0,
//       },
//     },
//   },
//   { timestamps: true }
// );

// export const HelperProfile = model(
//   "HelperProfile",
//   helperProfileSchema
// );
import { Schema, model, Types, Document } from "mongoose";

/* ---------------- ADDRESS SUB-SCHEMA ---------------- */
const addressSchema = new Schema(
  {
    fullAddress: {
      type: String,
      trim: true,
    },
    houseNo: {
      type: String,
      trim: true,
    },
    area: {
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
    pincode: {
      type: String,
      trim: true,
      match: /^[0-9]{6}$/,
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

export interface IHelperProfile extends Document {
  user: Types.ObjectId;
  phone: string;

  firstName: string;
  lastName: string;
  age: number;

  address?: {
    fullAddress?: string;
    houseNo?: string;
    area?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
    location?: {
      type: "Point";
      coordinates: [number, number];
    };
  };

  profileImage: string;
  idCardImage?: string;

  education:
    | "NO_FORMAL_EDUCATION"
    | "PRIMARY"
    | "SECONDARY"
    | "HIGHER_SECONDARY"
    | "GRADUATE"
    | "POST_GRADUATE";

  linkedSeniorIds: Types.Array<Types.ObjectId>;

  isActive: boolean;
  availability: "FULL_TIME" | "PART_TIME" | "ON_CALL";
  isVerified: boolean;

  rating: {
    average: number;
    count: number;
  };
}

const helperProfileSchema = new Schema<IHelperProfile>(
  {
    /* ---------------- LINKED USER ---------------- */
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      index: true,
    },

    /* ---------------- BASIC INFO ---------------- */
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

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    /* ---------------- ADDRESS ---------------- */
    address: {
      type: addressSchema,
      default: undefined,
    },

    profileImage: {
      type: String,
      required: true,
    },

    /* ---------------- DOCUMENTS ---------------- */
    idCardImage: {
      type: String,
      default: null,
    },

    /* ---------------- EDUCATION ---------------- */
    education: {
      type: String,
      enum: [
        "NO_FORMAL_EDUCATION",
        "PRIMARY",
        "SECONDARY",
        "HIGHER_SECONDARY",
        "GRADUATE",
        "POST_GRADUATE",
      ],
      required: true,
    },

    /* ---------------- WORK LINKS ---------------- */
    linkedSeniorIds: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    /* ---------------- STATUS ---------------- */
    isActive: {
      type: Boolean,
      default: true,
    },

    availability: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "ON_CALL"],
      default: "FULL_TIME",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ---------------- RATINGS ---------------- */
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

/* ---------------- GEO INDEX ---------------- */
helperProfileSchema.index({ "address.location": "2dsphere" });

export const HelperProfile = model<IHelperProfile>(
  "HelperProfile",
  helperProfileSchema
);
