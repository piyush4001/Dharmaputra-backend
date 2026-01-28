import { Request, Response } from 'express';
import { HelperProfile } from '../../models/Role/HelperProfile.model';
import { User } from '../../models/User.model';

/* =====================================================
   GET ALL HELPERS (ADMIN)
   ===================================================== */

export const getAllHelpers = async (req: Request, res: Response) => {
  try {
    const helpers = await HelperProfile.find()
      .populate('user', 'phone role')
      .sort({ createdAt: -1 });

    const formatted = helpers.map((h) => ({
      _id: h._id,
      name: `${h.firstName} ${h.lastName}`,
      phone: h.phone,
      status: h.isVerified ? 'Approved' : h.isActive ? 'Pending' : 'Rejected',
      profileImage: h.profileImage,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Get helpers error:', error);
    return res.status(500).json({
      message: 'Failed to fetch helpers',
    });
  }
};

/* =====================================================
   APPROVE HELPER
   ===================================================== */

export const approveHelper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const helper = await HelperProfile.findById(id);

    if (!helper) {
      return res.status(404).json({
        message: 'Helper not found',
      });
    }

    helper.isVerified = true;
    helper.isActive = true;

    await helper.save();

    return res.status(200).json({
      message: 'Helper approved successfully',
    });
  } catch (error) {
    console.error('Approve helper error:', error);
    return res.status(500).json({
      message: 'Failed to approve helper',
    });
  }
};

/* =====================================================
   REJECT / DISABLE HELPER
   ===================================================== */

export const rejectHelper = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const helper = await HelperProfile.findById(id);

    if (!helper) {
      return res.status(404).json({
        message: 'Helper not found',
      });
    }

    helper.isActive = false;
    helper.isVerified = false;

    await helper.save();

    return res.status(200).json({
      message: 'Helper rejected successfully',
    });
  } catch (error) {
    console.error('Reject helper error:', error);
    return res.status(500).json({
      message: 'Failed to reject helper',
    });
  }
};
/* =====================================================
   GET HELPER DETAILS (ADMIN)
   ===================================================== */

export const getHelperById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const helper = await HelperProfile.findById(id).populate(
      'user',
      'phone role',
    );

    if (!helper) {
      return res.status(404).json({
        message: 'Helper not found',
      });
    }

    return res.status(200).json({
      _id: helper._id,
      firstName: helper.firstName,
      lastName: helper.lastName,
      phone: helper.phone,
      age: helper.age,
      profileImage: helper.profileImage,
      education: helper.education,
      availability: helper.availability,
      isVerified: helper.isVerified,
      isActive: helper.isActive,
      address: helper.address,
      linkedSeniorIds: helper.linkedSeniorIds,
      rating: helper.rating,
    });
  } catch (error) {
    console.error('Get helper detail error:', error);
    return res.status(500).json({
      message: 'Failed to fetch helper details',
    });
  }
};
