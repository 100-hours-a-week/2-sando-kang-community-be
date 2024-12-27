const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload'); 
const authenticateJWT = require('../security/authenticateJWT'); // JWT 미들웨어 추가

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostsById);

router.post('/', authenticateJWT, upload.single('image'), postController.createPost); 
router.put('/', authenticateJWT, upload.single('image'), postController.updatePost);
router.patch('/', authenticateJWT, postController.patchPost);
router.delete('/', authenticateJWT, postController.deletePost);

module.exports = router;
