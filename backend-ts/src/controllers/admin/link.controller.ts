import { Response } from 'express';
import { AdminAuthRequest } from '../../middlewares/auth.middleware';
import { User } from '../../models/User.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';

/**
 * POST /api/admin/link-family
 * Admin links approved family member to approved senior
 */
export const linkFamilyToSenior = async (
  req: AdminAuthRequest,
  res: Response,
) => {
  try {
    const { familyUserId, seniorUserId } = req.body;

    if (!familyUserId || !seniorUserId) {
      return res.status(400).json({
        message: 'familyUserId and seniorUserId are required',
      });
    }

    /* =========================
       1️⃣ Validate Users
       ========================= */
    const [familyUser, seniorUser] = await Promise.all([
      User.findById(familyUserId),
      User.findById(seniorUserId),
    ]);

    if (!familyUser || familyUser.role !== 'FAMILY') {
      return res.status(400).json({
        message: 'Invalid family user',
      });
    }

    if (!seniorUser || seniorUser.role !== 'SENIOR') {
      return res.status(400).json({
        message: 'Invalid senior user',
      });
    }

    /* =========================
       2️⃣ Fetch Profiles
       ========================= */
    const [familyProfile, seniorProfile] = await Promise.all([
      FamilyProfile.findOne({ userId: familyUser._id }),
      SeniorProfile.findOne({ user: seniorUser._id }),
    ]);

    if (!familyProfile || !seniorProfile) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }

    /* =========================
       3️⃣ Approval Enforcement
       ========================= */
    if (!familyProfile.isApproved) {
      return res.status(400).json({
        message: 'Family member is not approved',
      });
    }

    if (!seniorProfile.isApproved) {
      return res.status(400).json({
        message: 'Senior is not approved',
      });
    }

    /* =========================
       4️⃣ Prevent Duplicate Link
       ========================= */
    const alreadyLinked = familyProfile.seniorIds.some(
      (id) => id.toString() === seniorUser._id.toString(),
    );

    if (alreadyLinked) {
      return res.status(400).json({
        message: 'Family member already linked to this senior',
      });
    }

    /* =========================
       5️⃣ Link (SOURCE OF TRUTH)
       ========================= */
    familyProfile.seniorIds.push(seniorUser._id);
    await familyProfile.save();

    return res.status(200).json({
      message: 'Family member successfully linked to senior',
    });
  } catch (error) {
    console.error('LINK FAMILY ERROR:', error);
    return res.status(500).json({
      message: 'Failed to link family member',
    });
  }
};

/**
 * POST /api/admin/unlink-family
 * Admin unlinks family member from senior
 */
export const unlinkFamilyFromSenior = async (
  req: AdminAuthRequest,
  res: Response,
) => {
  try {
    const { familyUserId, seniorUserId } = req.body;

    if (!familyUserId || !seniorUserId) {
      return res.status(400).json({
        message: 'familyUserId and seniorUserId are required',
      });
    }

    /* =========================
       1️⃣ Validate Users
       ========================= */
    const [familyUser, seniorUser] = await Promise.all([
      User.findById(familyUserId),
      User.findById(seniorUserId),
    ]);

    if (!familyUser || familyUser.role !== 'FAMILY') {
      return res.status(400).json({
        message: 'Invalid family user',
      });
    }

    if (!seniorUser || seniorUser.role !== 'SENIOR') {
      return res.status(400).json({
        message: 'Invalid senior user',
      });
    }

    /* =========================
       2️⃣ Fetch Family Profile
       ========================= */
    const familyProfile = await FamilyProfile.findOne({
      userId: familyUser._id,
    });

    if (!familyProfile) {
      return res.status(404).json({
        message: 'Family profile not found',
      });
    }
    /* =========================
       3️⃣ Unlink (SOURCE OF TRUTH)
       ========================= */
    // Before
    const before = familyProfile.seniorIds.length;

    // ✅ Correct Mongoose-safe removal
    familyProfile.seniorIds.pull(seniorUser._id);

    if (before === familyProfile.seniorIds.length) {
      return res.status(400).json({
        message: 'Family member is not linked to this senior',
      });
    }

    await familyProfile.save();

    return res.status(200).json({
      message: 'Family member unlinked from senior',
    });
  } catch (error) {
    console.error('UNLINK FAMILY ERROR:', error);
    return res.status(500).json({
      message: 'Failed to unlink family member',
    });
  }
};
