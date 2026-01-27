// Location service
import { Types } from "mongoose";
import { Location } from "../models/Location.model";

// Save location data
export const saveLocation = async ({
  userId,
//  panicId,
  latitude,
  longitude,
  accuracy,
  address,
}: {
  userId: Types.ObjectId;
 // panicId?: Types.ObjectId;
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}) => {
  return await Location.create({
    userId,
   // panicId,
    latitude,
    longitude,
    accuracy,
    address,
  });
};
