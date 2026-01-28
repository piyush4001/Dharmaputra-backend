import multer from "multer";
import  {cloudinary} from "../utils/cloudinary"

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB (video safe)
  },
});

export const uploadImage = async (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    folder: 'dharmaputra/profile',
    resource_type: 'image',
  });
};
export default upload;
