import { Request } from 'express';
import { AdminRole } from '../constants/roles';

export interface AdminAuthRequest extends Request {
  admin: {
    id: string;
    role: AdminRole;
  };
}
