import { Request, Response } from 'express';
import Admin from '../../models/admin.model';

import { AdminAuthRequest } from '../../middlewares/auth.middleware';

/**
 * SUPER_ADMIN ONLY
 * Activate / Deactivate an admin
 */
export const toggleAdminStatus = async (
  req: AdminAuthRequest,
  res: Response,
) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
      });
    }

    // Prevent disabling yourself (optional but smart)
    if (req.admin?.id === adminId) {
      return res.status(400).json({
        message: 'You cannot deactivate yourself',
      });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    return res.status(200).json({
      message: `Admin ${
        admin.isActive ? 'activated' : 'deactivated'
      } successfully`,
      admin: {
        id: admin._id,
        email: admin.email,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error('Toggle admin status error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
