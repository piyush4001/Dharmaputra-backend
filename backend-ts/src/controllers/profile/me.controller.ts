import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { User } from '../../models/User.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';
import { HelperProfile } from '../../models/Role/HelperProfile.model';

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.auth!;

    const user = await User.findById(userId).select('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile: any = null;

    if (user.role === 'SENIOR') {
      profile = await SeniorProfile.findOne({ user: userId }).lean();
    } else if (user.role === 'FAMILY') {
      profile = await FamilyProfile.findOne({ userId }).lean();
    } else if (user.role === 'HELPER') {
      profile = await HelperProfile.findOne({ user: userId }).lean();
    }

    // 🟡 Profile not created yet
    if (!profile) {
      return res.status(200).json({
        role: user.role,
        profile: null,
      });
    }

    // ✅ Always attach role
    return res.status(200).json({
      role: user.role,
      ...profile,
    });
  } catch (error) {
    console.error('getMyProfile error:', error);
    return res.status(500).json({
      message: 'Failed to fetch profile',
    });
  }
};
