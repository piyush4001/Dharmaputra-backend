import { Request } from "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      _id?: Types.ObjectId;
      role?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};


