import { Response } from 'express';
import { AdminAuthRequest } from '../../middlewares/auth.middleware';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';

export const getAllSeniors = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { search, minAge, maxAge, page = '1', limit = '10' } = req.query;

    const query: any = {};

    /* =========================
         SEARCH BY NAME
         ========================= */
    if (search && typeof search === 'string') {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    /* =========================
         AGE FILTER
         ========================= */
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;
    // const seniors = await SeniorProfile.find(query)
    //   .sort({ createdAt: -1 })
    //   .select('firstName lastName age address emergencyContact createdAt')
    //   .lean();
    const [seniors, total] = await Promise.all([
      SeniorProfile.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .select('firstName lastName age address emergencyContact createdAt')
        .lean(),

      SeniorProfile.countDocuments(query),
    ]);

    return res.status(200).json({
      seniors,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get seniors error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
/**
 * ADMIN + SUPER_ADMIN
 * Get single senior details
 */
export const getSeniorById = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const senior = await SeniorProfile.findById(id)
      .select(
        'firstName lastName age address emergencyContact medicalInfo createdAt  isApproved approvedAt',
      )
      .lean();

    if (!senior) {
      return res.status(404).json({
        message: 'Senior not found',
      });
    }

    return res.status(200).json({ senior });
  } catch (error) {
    console.error('Get senior by id error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

/**
 * ADMIN + SUPER_ADMIN
 * Get linked family members for a senior
 */

/**
 * ADMIN + SUPER_ADMIN
 * Get linked family members for a senior
 */
export const getLinkedFamiliesBySenior = async (
  req: AdminAuthRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get senior profile
    const senior = await SeniorProfile.findById(id).select('user').lean();

    if (!senior) {
      return res.status(404).json({
        message: 'Senior not found',
      });
    }

    // 2️⃣ Find families linked via USER ID
    const families = await FamilyProfile.find({
      seniorIds: senior.user, // ✅ CORRECT
    })
      .select(
        'firstName lastName phoneNumber relation customRelation isPrimaryContact',
      )
      .lean();

    return res.status(200).json({
      families,
    });
  } catch (error) {
    console.error('Get linked families error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const approveSenior = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const senior = await SeniorProfile.findByIdAndUpdate(
      id,
      {
        isApproved: true,
        approvedAt: new Date(),
      },
      { new: true },
    );

    if (!senior) {
      return res.status(404).json({ message: 'Senior not found' });
    }

    return res.status(200).json({
      message: 'Senior approved',
      isApproved: senior.isApproved,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
