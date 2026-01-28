// import { RequestHandler } from 'express';
// import { Emergency } from '../../models/Emergency.model';

// export const getResolvedEmergencies: RequestHandler = async (req, res) => {
//   try {
//     const emergencies = await Emergency.find({
//       status: 'RESOLVED',
//     })
//       .sort({ resolvedAt: -1 })
//       // ✅ ONLY populate fields that actually exist
//       .populate('userId', 'phone role name profileImage')
//       .populate('respondedBy', 'phone role name profileImage');

//     res.status(200).json(emergencies);
//   } catch (error) {
//     console.error('❌ RESOLVED EMERGENCY FETCH ERROR:', error);
//     return res.status(500).json({
//       message: 'Failed to fetch resolved emergencies',
//       error: String(error),
//     });
//   }
// };
import { RequestHandler } from 'express';
import { Emergency } from '../../models/Emergency.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';

export const getResolvedEmergencies: RequestHandler = async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      status: 'RESOLVED',
    })
      .sort({ resolvedAt: -1 })
      .populate('userId', 'phone profileImage');

    // 🔥 MANUALLY attach senior profile
    const enriched = await Promise.all(
      emergencies.map(async (em) => {
        const seniorProfile = await SeniorProfile.findOne({
          user: em.userId?._id,
        }).select('firstName lastName profileImage');

        return {
          ...em.toObject(),
          seniorProfile,
        };
      }),
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error('Resolved emergencies error:', error);
    res.status(500).json({ message: 'Failed to fetch resolved emergencies' });
  }
};
