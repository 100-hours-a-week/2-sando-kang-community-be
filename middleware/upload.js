const multer = require('multer');

// 메모리 스토리지 설정
const upload = multer({
    storage: multer.memoryStorage(), // 파일을 메모리에 저장
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한: 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('JPG, PNG, GIF만 허용됩니다.'));
        }
    },
});

module.exports = upload;
