import { Response } from 'express';
import { AdminAuthRequest } from '../../middlewares/auth.middleware';

import { FamilyProfile } from '../../models/Role/FamilyProfile.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { HelperProfile } from '../../models/Role/HelperProfile.model';
import { Emergency } from '../../models/Emergency.model';

/**
 * ADMIN + SUPER_ADMIN
 * Dashboard statistics
 */
export const getDashboardStats = async (
  _req: AdminAuthRequest,
  res: Response,
) => {
  try {
    const [familyCount, seniorCount, activeHelpers, sosLast24h, totalSOS] =
      await Promise.all([
        FamilyProfile.countDocuments(),
        SeniorProfile.countDocuments(),
        HelperProfile.countDocuments({ isActive: true }),
        Emergency.countDocuments({
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        }),
        Emergency.countDocuments(),
      ]);

    return res.status(200).json({
      totalUsers: familyCount + seniorCount,
      totalSeniors: seniorCount,
      activeHelpers,
      sosLast24h,
      totalSOS,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
