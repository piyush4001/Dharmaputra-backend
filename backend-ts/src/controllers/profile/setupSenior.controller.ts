import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SeniorProfile } from "../../models/Role/SeniorProfile.model";

export const setupSeniorProfile = async (
  req: AuthRequest,
  res: Response,
) => {
  const { userId } = req.auth!;
  const { firstName,surname,age, address, emergencyContact, medicalInfo } = req.body;

  if (!age || !address) {
    return res
      .status(400)
      .json({ message: "Required fields missing" });
  }

  await SeniorProfile.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      firstName,
      surname,
      age,
      address,
      emergencyContact,
      medicalInfo,
    },
    { upsert: true, new: true },
  );

  res.json({ message: "Senior profile saved" });
};
