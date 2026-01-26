<<<<<<< HEAD
// import { Request, Response } from 'express';
// import { User } from '../../models/User.model';

// /**
//  * GET /api/admin/users
//  * Returns Seniors + Family members only
//  */
// export const getAdminUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await User.find({
//       role: { $in: ['SENIOR', 'FAMILY'] },
//     })
//       .select('_id name phone role isActive createdAt')
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json(users);
//   } catch (err) {
//     console.error('ADMIN USERS ERROR:', err);
//     return res.status(500).json({
//       message: 'Failed to fetch users',
//     });
//   }
// };

=======
>>>>>>> origin/krishnapal
import { Request, Response } from 'express';
import { User } from '../../models/User.model';
import { SeniorProfile } from '../../models/Role/SeniorProfile.model';
import { FamilyProfile } from '../../models/Role/FamilyProfile.model';

export const getAdminUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({
      role: { $in: ['SENIOR', 'FAMILY'] },
    })
      .select('_id phone role isActive')
      .lean();

    const usersWithNames = await Promise.all(
      users.map(async (user: any) => {
        let name: string | null = null;

        if (user.role === 'SENIOR') {
          const profile = await SeniorProfile.findOne(
            { user: user._id },
            'firstName lastName',
          ).lean();

          if (profile) {
            name = `${profile.firstName} ${profile.lastName ?? ''}`.trim();
          }
        }

        if (user.role === 'FAMILY') {
          const profile = await FamilyProfile.findOne(
            { userId: user._id },
            'firstName lastName',
          ).lean();

          if (profile) {
            name = `${profile.firstName} ${profile.lastName ?? ''}`.trim();
          }
        }

        return {
          ...user,
          name,
        };
      }),
    );

    return res.status(200).json(usersWithNames);
  } catch (err) {
    console.error('ADMIN USERS ERROR:', err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};
