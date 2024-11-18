const multer = require('multer');
const path = require('path');

// Multer 설정 (이미지 업로드 처리)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 파일 저장 경로
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = Date.now() + ext; // 고유한 파일 이름 생성
        cb(null, fileName);
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
