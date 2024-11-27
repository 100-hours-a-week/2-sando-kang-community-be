const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const upload = require('../middleware/upload'); 

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/signin',upload.single('profile'), authController.signin);
router.post('/withdraw', authController.withdraw);
router.patch('/nickname', upload.single('profile'), authController.updateNickname);
router.patch('/password', authController.updatePassword);

module.exports = router;
