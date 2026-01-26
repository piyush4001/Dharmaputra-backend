import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: 'dharmaputra/profile',
    resource_type: 'image',
  });
};
