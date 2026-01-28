import { Request, Response } from "express";
import Feedback from "../../models/Feedback.model";

export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const { role, type } = req.query;

    const filter: any = {};

    if (role) filter.role = role;
    if (type) filter.type = type;

    const feedbacks = await Feedback.find(filter)
      .populate("user", "firstName lastName phone role")
      .sort({ createdAt: -1 });

    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedbacks",
    });
  }
};
