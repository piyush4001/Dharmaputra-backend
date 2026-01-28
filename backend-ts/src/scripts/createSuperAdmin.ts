import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import Admin from '../models/admin.model';
import { AdminRole } from '../constants/roles';

// ✅ LOAD ENV VARIABLES
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const existing = await Admin.findOne({
      email: 'superadmin@dharmaputra.com',
    });

    if (existing) {
      //('✅ SUPER_ADMIN already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('superadmin123', 10);

    await Admin.create({
      email: 'superadmin@dharmaputra.com',
      password: hashedPassword,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    });

    //('🎉 SUPER_ADMIN created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating SUPER_ADMIN:', error);
    process.exit(1);
  }
};

createSuperAdmin();
