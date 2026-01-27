// import { Schema, model, Types } from "mongoose";

// const seniorProfileSchema = new Schema(
//   {
//     user: {
//       type: Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//      // required: true,
//       index: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       default: "",
//     },
//     age: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       type: String,
//       required: true,
//     },
//     profileImage: {
//       type: String,
//       required: true, // or false if you want optional
//     },
//     idCardImage: {
//       type: String,
//       default: null,
//     },

//     emergencyContact: {
//       type: String,
//     },

//     medicalInfo: {
//       type: String,
//     },
//     familyIds: [
//       {
//         type: Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     helperIds: [
//       {
//         type: Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     isApproved: {
//       type: Boolean,
//       default: false,
//     },

//     approvedAt: {
//       type: Date,
//     },
//   },
//   { timestamps: true },
// );

// export const SeniorProfile = model(
//   "SeniorProfile",
//   seniorProfileSchema,
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

export interface ISeniorProfile extends Document {
  user: Types.ObjectId;
  phone?: string;

  firstName: string;
  lastName?: string;
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

  emergencyContact?: string;
  medicalInfo?: string;

  familyIds: Types.Array<Types.ObjectId>;
  helperIds: Types.Array<Types.ObjectId>;

  isApproved: boolean;
  approvedAt?: Date;
}

const seniorProfileSchema = new Schema<ISeniorProfile>(
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
      default: "",
      trim: true,
    },

    age: {
      type: Number,
      required: true,
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

    idCardImage: {
      type: String,
      default: null,
    },

    /* ---------------- MEDICAL & EMERGENCY ---------------- */
    emergencyContact: {
      type: String,
      trim: true,
    },

    medicalInfo: {
      type: String,
      trim: true,
    },

    /* ---------------- RELATIONS ---------------- */
    familyIds: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    helperIds: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    /* ---------------- APPROVAL ---------------- */
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

/* ---------------- GEO INDEX ---------------- */
seniorProfileSchema.index({ "address.location": "2dsphere" });

export const SeniorProfile = model<ISeniorProfile>(
  "SeniorProfile",
  seniorProfileSchema
);
