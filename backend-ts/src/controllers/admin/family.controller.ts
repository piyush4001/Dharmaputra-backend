import { Response } from 'express';
import { AdminAuthRequest } from '../../middlewares/auth.middleware';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
/**
 * ADMIN + SUPER_ADMIN
 * Fetch all family members
 */
export const getAllFamilies = async (_req: AdminAuthRequest, res: Response) => {
  try {
    const families = await FamilyProfile.find()
      .sort({ createdAt: -1 })
      .select(
        'firstName lastName phoneNumber relation customRelation isPrimaryContact createdAt',
      )
      .lean();

    return res.status(200).json({
      families,
    });
  } catch (error) {
    console.error('Get families error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getLinkedSeniorsByFamily = async (
  req: AdminAuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const family = await FamilyProfile.findById(id).select('seniorIds').lean();

    if (!family) {
      return res.status(404).json({
        message: 'Family member not found',
      });
    }

    const seniors = await SeniorProfile.find({
      user: { $in: family.seniorIds },
    })
      .select('firstName lastName age address createdAt')
      .lean();

    return res.status(200).json({
      seniors,
    });
  } catch (error) {
    console.error('Get linked seniors error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getFamilyById = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const family = await FamilyProfile.findById(id)
      .select(
        'firstName lastName phoneNumber relation customRelation isPrimaryContact address createdAt  isApproved approvedAt',
      )
      .lean();

    if (!family) {
      return res.status(404).json({
        message: 'Family member not found',
      });
    }

    return res.status(200).json({ family });
  } catch (error) {
    console.error('Get family by id error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const approveFamily = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const family = await FamilyProfile.findByIdAndUpdate(
      id,
      {
        isApproved: true,
        approvedAt: new Date(),
      },
      { new: true },
    );

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    return res.status(200).json({
      message: 'Family approved',
    });
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
