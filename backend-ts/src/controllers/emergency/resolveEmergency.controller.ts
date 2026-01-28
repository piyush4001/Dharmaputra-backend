// import { Response } from 'express';
// import { AuthRequest } from '../../middlewares/auth.middleware';
// import { Emergency } from '../../models/Emergency.model';
// import { UserRole } from '../../models/User.model';

// export const resolveEmergency = async (req: AuthRequest, res: Response) => {
//   try {
//     console.log('🔥 resolveEmergency HIT', req.body);

//     const userId = req.auth?.userId;
//     const role = req.auth?.role;

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     if (![UserRole.SENIOR, UserRole.HELPER].includes(role as UserRole)) {
//       return res.status(403).json({
//         message: 'Not allowed to resolve emergency',
//       });
//     }

//     const emergency = await Emergency.findOne({
//       userId,
//       status: 'ACTIVE',
//     });

//     if (!emergency) {
//       return res.status(404).json({
//         message: 'No active emergency',
//       });
//     }

//     emergency.status = 'RESOLVED';
//     emergency.resolvedAt = new Date();
//     await emergency.save();

//     return res.status(200).json({
//       message: 'Emergency resolved',
//     });
//   } catch (error) {
//     console.error('Resolve emergency error:', error);
//     return res.status(500).json({
//       message: 'Failed to resolve emergency',
//     });
//   }
// };
import { RequestHandler } from 'express';
import { Emergency } from '../../models/Emergency.model';

export const resolveEmergency: RequestHandler = async (req, res) => {
  console.log('🚀 resolveEmergency controller START');

  try {
    const { emergencyId } = req.body;
    console.log('📦 emergencyId:', emergencyId);

    if (!emergencyId) {
      console.log('❌ emergencyId missing');
      return res.status(400).json({ message: 'emergencyId required' });
    }

    const emergency = await Emergency.findById(emergencyId);
    console.log('🔍 emergency found:', !!emergency);

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    emergency.status = 'RESOLVED';
    emergency.resolvedAt = new Date();

    await emergency.save();
    console.log('✅ emergency saved');

    return res.status(200).json({
      message: 'Emergency resolved successfully',
    });
  } catch (error) {
    console.error('🔥 resolveEmergency ERROR:', error);
    return res.status(500).json({
      message: 'Failed to resolve emergency',
    });
  }
};
