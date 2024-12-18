const multer = require('multer');

// 메모리 스토리지 설정
const upload = multer({
  storage: multer.memoryStorage(), // 파일을 메모리에 저장
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한: 5MB
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(null, true); // 파일이 없으면 에러 없이 넘어감
      return;
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // 허용된 파일 형식
    } else {
      cb(new Error('JPG, PNG, GIF만 허용됩니다.')); // 허용되지 않은 파일 형식
    }
  },
});

module.exports = upload;
