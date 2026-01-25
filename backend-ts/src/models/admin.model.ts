import mongoose, { Schema, Document } from 'mongoose';
import { AdminRole } from '../constants/roles';

export interface AdminDocument extends Document {
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.ADMIN,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<AdminDocument>('Admin', AdminSchema);
