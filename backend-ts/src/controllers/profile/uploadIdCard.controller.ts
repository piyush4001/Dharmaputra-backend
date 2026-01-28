import { Response } from 'express';
import fs from 'fs';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { uploadImage } from '../../utils/cloudinary';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';
import { HelperProfile } from '../../models/Role/HelperProfile.model';

export const uploadIdCard = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, role } = req.auth!;

    if (!req.file) {
      return res.status(400).json({
        message: 'ID card image is required',
      });
    }

    let profile: any = null;

    /* ---------------- FETCH PROFILE (ROLE AWARE) ---------------- */
    if (role === 'SENIOR') {
      profile = await SeniorProfile.findOne({ user: userId });
    } else if (role === 'HELPER') {
      profile = await HelperProfile.findOne({ user: userId });
    } else if (role === 'FAMILY') {
      profile = await FamilyProfile.findOne({ userId });
    } else {
      return res.status(400).json({
        message: 'Invalid role',
      });
    }

    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }

    /* ---------------- BLOCK RE-UPLOAD ---------------- */
    if (profile.idCardImage) {
      return res.status(409).json({
        message: 'ID card already uploaded',
      });
    }

    /* ---------------- UPLOAD TO CLOUDINARY ---------------- */
    const uploaded = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); // cleanup temp file

    profile.idCardImage = uploaded.secure_url;
    await profile.save();

    return res.status(200).json({
      message: 'ID card uploaded successfully',
    });
  } catch (error) {
    console.error('uploadIdCard error:', error);
    return res.status(500).json({
      message: 'Failed to upload ID card',
    });
  }
};
