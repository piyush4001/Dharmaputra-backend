import { Request, Response } from 'express';
import Admin from '../../models/admin.model';

/**
 * SUPER_ADMIN ONLY
 * List all admins
 */
export const listAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await Admin.find().select(
      '_id email role isActive createdAt',
    );

    return res.status(200).json({
      admins,
    });
  } catch (error) {
    console.error('List admins error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
