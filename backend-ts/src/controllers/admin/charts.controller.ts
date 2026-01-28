import { Response } from 'express';
import { AdminAuthRequest } from '../../middlewares/auth.middleware';
import { Emergency } from '../../models/Emergency.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';

/**
 * ADMIN + SUPER_ADMIN
 * Dashboard charts data
 */
export const getDashboardCharts = async (
  _req: AdminAuthRequest,
  res: Response,
) => {
  try {
    /* =========================
       SOS TREND (LAST 7 DAYS)
       ========================= */
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        return d;
      })
      .reverse();

    const sosTrend = await Promise.all(
      last7Days.map(async (day, index) => {
        const nextDay = new Date(day);
        nextDay.setDate(day.getDate() + 1);

        const count = await Emergency.countDocuments({
          triggeredAt: { $gte: day, $lt: nextDay },
        });

        return {
          name: day.toLocaleDateString('en-US', { weekday: 'short' }),
          sos: count,
        };
      }),
    );

    /* =========================
       USER GROWTH (LAST 5 MONTHS)
       ========================= */
    const userGrowth = await Promise.all(
      [...Array(5)].map(async (_, i) => {
        const start = new Date();
        start.setMonth(start.getMonth() - (4 - i), 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);

        const familyCount = await FamilyProfile.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });

        const seniorCount = await SeniorProfile.countDocuments({
          createdAt: { $gte: start, $lt: end },
        });

        return {
          name: start.toLocaleDateString('en-US', { month: 'short' }),
          users: familyCount + seniorCount,
        };
      }),
    );

    return res.status(200).json({
      sosTrend,
      userGrowth,
    });
  } catch (error) {
    console.error('Charts error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
