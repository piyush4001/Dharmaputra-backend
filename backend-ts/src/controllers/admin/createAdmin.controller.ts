// import { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
// import Admin from '../../models/admin.model';
// import { AdminRole } from '../../constants/roles';

// /**
//  * SUPER_ADMIN ONLY
//  * Create a new admin (saved to DB)
//  */
// export const createAdmin = async (req: Request, res: Response) => {
//   try {
//     const { email, password, role } = req.body;

//     // 1️⃣ Basic validation
//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Email and password are required',
//       });
//     }

//     // 2️⃣ Check duplicate email
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(409).json({
//         message: 'Admin with this email already exists',
//       });
//     }

//     // 3️⃣ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4️⃣ Decide role safely
//     const adminRole =
//       role === AdminRole.SUPER_ADMIN ? AdminRole.SUPER_ADMIN : AdminRole.ADMIN;

//     // 5️⃣ Create admin in DB
//     const admin = await Admin.create({
//       email,
//       password: hashedPassword,
//       role: adminRole,
//       isActive: true,
//     });

//     // 6️⃣ Respond (never send password)
//     return res.status(201).json({
//       message: 'Admin created successfully',
//       admin: {
//         id: admin._id,
//         email: admin.email,
//         role: admin.role,
//         isActive: admin.isActive,
//       },
//     });
//   } catch (error) {
//     console.error('Create admin error:', error);
//     return res.status(500).json({
//       message: 'Internal server error',
//     });
//   }
// };

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../../models/admin.model';
import { AdminRole } from '../../constants/roles';

/**
 * SUPER_ADMIN ONLY
 * Create a new admin (saved to DB)
 */
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // 1️⃣ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // 2️⃣ Check duplicate email
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        message: 'Admin with this email already exists',
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Decide role safely
    const adminRole =
      role === AdminRole.SUPER_ADMIN ? AdminRole.SUPER_ADMIN : AdminRole.ADMIN;

    // 5️⃣ Create admin in DB
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: adminRole,
      isActive: true,
    });

    // 6️⃣ Respond (never send password)
    return res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
