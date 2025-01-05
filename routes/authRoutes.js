const express = require('express');
const authController = require('../controllers/authController');

const upload = require('../middleware/upload');
const authenticateJWT = require('../security/authenticateJWT'); 

const router = express.Router();

router.post('/login', authController.login);
router.post('/signin',upload.single('profile'), authController.signin);

router.post('/logout', authenticateJWT, authController.logout);
router.post('/withdraw', authenticateJWT, authController.withdraw);
router.patch('/nickname', authenticateJWT, upload.single('profile'), authController.updateNickname);
router.patch('/password', authenticateJWT, authController.updatePassword);

module.exports = router;
