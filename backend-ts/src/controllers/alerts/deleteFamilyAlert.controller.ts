import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { FamilyAlert } from "../../models/FamilyAlert.model";

export const deleteFamilyAlert = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.auth!; // ✅ correct
    const { alertId } = req.params;

    if (!alertId) {
      return res.status(400).json({ message: "Alert ID is required" });
    }

    const alert = await FamilyAlert.findOne({
      _id: alertId,
      familyId: userId,
    });

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // ✅ Soft delete
    alert.isDeletedByFamily = true;
    await alert.save();

    return res.status(200).json({
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("deleteFamilyAlert error:", error);
    return res.status(500).json({
      message: "Failed to delete alert",
    });
  }
};
