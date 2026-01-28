import { Request, Response } from 'express';
import { User } from '../../models/User.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';

export const getUserProfileByAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('phone role isActive');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;

    if (user.role === 'SENIOR') {
      profile = await SeniorProfile.findOne({ user: userId });
    } else if (user.role === 'FAMILY') {
      profile = await FamilyProfile.findOne({ userId });
    }

    return res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    console.error('ADMIN PROFILE ERROR:', error);
    return res.status(500).json({
      message: 'Failed to fetch user profile',
    });
  }
};
