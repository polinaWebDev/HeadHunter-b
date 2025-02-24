import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      callback(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req, file, callback) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const fileExtension = extname(file.originalname).toLowerCase();
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && fileTypes.test(fileExtension)) {
      return callback(null, true);
    } else {
      callback(new Error('Только изображения разрешены'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};