import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
    storage: diskStorage({
        // Папка для сохранения загруженных файлов
        destination: './uploads', // Путь к папке, где будут храниться файлы
        filename: (req, file, callback) => {
            // Генерация уникального имени для файла
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            callback(null, uniqueSuffix + extname(file.originalname)); // Сохраняем с расширением
        },
    }),
    fileFilter: (req, file, callback) => {
        // Фильтр файлов (например, только изображения)
        const fileTypes = /jpeg|jpg|png|gif/;
        const fileExtension = extname(file.originalname).toLowerCase();  // Убираем конфликт с переменной extname
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && fileTypes.test(fileExtension)) {
            return callback(null, true); // Разрешаем загрузку
        } else {
            callback(new Error('Только изображения разрешены'), false); // Отклоняем файлы
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // Ограничение на размер файла (5 МБ)
    },
};