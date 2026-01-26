import { Response } from 'express';
import fs from 'fs';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { HelperProfile } from '../../models/Role/HelperProfile.model';
import { User } from '../../models/User.model';
import { uploadImage } from '../../utils/cloudinary';

export const setupHelperProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.auth!;

    if (role !== 'HELPER') {
      return res.status(403).json({
        message: 'Only helpers can create helper profile',
      });
    }

    const { firstName, lastName, age, address, education } = req.body;

    if (!firstName || !lastName || !age || !address || !education) {
      return res.status(400).json({
        message: 'All required fields must be provided',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'Profile image is required',
      });
    }

    /* ---------------- CHECK EXISTING PROFILE ---------------- */
    const existingProfile = await HelperProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(409).json({
        message: 'Helper profile already exists',
      });
    }

    /* ---------------- FETCH USER PHONE ---------------- */
    const user = await User.findById(userId).select('phone');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    /* ---------------- UPLOAD IMAGE ---------------- */
    const uploaded = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup temp file
    //parrsed address:
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return res.status(400).json({
        message: 'Invalid address format',
      });
    }
    /* ---------------- CREATE PROFILE ---------------- */
    const helperProfile = await HelperProfile.create({
      user: userId,
      phone: user.phone, // 🔥 AUTO-INJECTED
      firstName,
      lastName,
      age,
      //address,
      address: {
        houseNo: parsedAddress.houseNo || '',
        area: parsedAddress.area,
        city: parsedAddress.city,
        state: parsedAddress.state,
        pincode: parsedAddress.pincode,
      },
      education,
      profileImage: uploaded.secure_url,
    });

    return res.status(201).json({
      message: 'Helper profile created successfully',
      helperProfile,
    });
  } catch (error) {
    console.error('setupHelperProfile error:', error);
    return res.status(500).json({
      message: 'Failed to setup helper profile',
    });
  }
};
