import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { User } from '../../models/User.model';
import { uploadImage } from '../../utils/cloudinary';
import fs from 'fs';

export const setupSeniorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.auth!;

    if (role !== 'SENIOR') {
      return res
        .status(403)
        .json({ message: 'Only seniors can create profile' });
    }

    // 🚫 Prevent re-setup
    const existing = await SeniorProfile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({
        message: 'Senior profile already exists',
      });
    }

    const { firstName, lastName, age, address, emergencyContact, medicalInfo } =
      req.body;

    // if (!age || !address) {
    //   return res.status(400).json({
    //     message: 'Age and address are required',
    //   });
    // }
    const ageNumber = Number(age);

    if (!ageNumber || !address || address.trim() === '') {
      return res.status(400).json({
        message: 'Age and address are required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'Profile image is required',
      });
    }

    const user = await User.findById(userId).select('phone');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ☁️ Upload image
    const uploaded = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup temp file

    const profile = await SeniorProfile.create({
      user: userId,
      firstName,
      lastName,
      age,
      address,
      emergencyContact,
      medicalInfo,
      phone: user.phone,
      profileImage: uploaded.secure_url,
    });

    return res.json({
      message: 'Senior profile created successfully',
      profile,
    });
  } catch (error) {
    console.error('setupSeniorProfile error:', error);
    return res.status(500).json({
      message: 'Failed to setup senior profile',
    });
  }
};
