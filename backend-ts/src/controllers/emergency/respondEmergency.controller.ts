
import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { Emergency } from '../../models/Emergency.model';
import mongoose from 'mongoose';


export const respondEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.auth!;
    const { emergencyId, status } = req.body;


    if (!['RESPONDED', 'UNABLE_TO_REACH'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {

      return res.status(404).json({ message: 'Emergency not found' });
    }

    emergency.responseStatus = status;
    emergency.respondedBy = new mongoose.Types.ObjectId(userId);
    emergency.respondedAt = new Date();


    if (status === 'RESPONDED') {
      emergency.status = 'RESOLVED';
    }

    await emergency.save();


    return res.json({ message: 'Emergency updated', emergency });
  } catch (err) {
    console.error('respondEmergency error:', err);
    return res.status(500).json({ message: 'Failed to respond' });
  }
};
