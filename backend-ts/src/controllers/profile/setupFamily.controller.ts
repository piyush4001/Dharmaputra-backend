import { Response } from 'express';
import fs from 'fs';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';
import { User } from '../../models/User.model';
import { uploadImage } from '../../utils/cloudinary';

export const setupFamilyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.auth!;

    if (role !== 'FAMILY') {
      return res.status(403).json({
        message: 'Only family users can create family profile',
      });
    }

    const { firstName, lastName, address } = req.body;

    if (!firstName || !lastName || !address) {
      return res.status(400).json({
        message: 'First name, last name and address are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'Profile image is required',
      });
    }

    // 🚫 Prevent re-setup
    const existingProfile = await FamilyProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(409).json({
        message: 'Family profile already exists',
      });
    }

    // 📞 Get phone number from User (OTP login source)
    const user = await User.findById(userId).select('phone');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ☁️ Upload image to Cloudinary
    const uploaded = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup temp file

    // ✅ Create family profile
    const profile = await FamilyProfile.create({
      userId,
      firstName,
      lastName,
      address,
      phone: user.phone,
      seniorIds: [],
      profileImage: uploaded.secure_url,
    });

    return res.status(201).json({
      message: 'Family profile created successfully',
      profile,
    });
  } catch (error) {
    console.error('setupFamilyProfile error:', error);
    return res.status(500).json({
      message: 'Failed to setup family profile',
    });
  }
};
