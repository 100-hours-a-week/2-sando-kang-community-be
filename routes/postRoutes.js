const express = require('express');
const multer = require('multer');
const router = express.Router();
const postController = require('../controllers/postController');

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostsById);
router.post('/', postController.createPost);
router.put('/', upload.single('image'), postController.updatePost);
router.delete('/', postController.deletePost);

module.exports = router;
