import { Response } from 'express';
import { AdminAuthRequest } from '../../middlewares/auth.middleware';
import { Emergency } from '../../models/Emergency.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';

/**
 * ADMIN + SUPER_ADMIN
 * Fetch recent SOS (last 10) with senior name
 */
export const getRecentSOS = async (_req: AdminAuthRequest, res: Response) => {
  try {
    const emergencies = await Emergency.find()
      .sort({ triggeredAt: -1 })
      .limit(10)
      .lean();

    const sosWithSenior = await Promise.all(
      emergencies.map(async (sos) => {
        const senior = await SeniorProfile.findOne({
          user: sos.userId,
        })
          .select('firstName lastName')
          .lean<{ firstName: string; lastName: string } | null>();

        return {
          _id: sos._id,
          triggerType: sos.triggerType,
          status: sos.status,
          triggeredAt: sos.triggeredAt,
          seniorName: senior ? `${senior.firstName} ${senior.lastName}` : null,
        };
      }),
    );

    return res.status(200).json({
      sos: sosWithSenior,
    });
  } catch (error) {
    console.error('Recent SOS error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
