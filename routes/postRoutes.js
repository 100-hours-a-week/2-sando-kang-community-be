const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

const upload = require('../middleware/upload'); 

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPostsById);
router.post('/', upload.single('image'), postController.createPost); 
router.post('/views', postController.updateViews);
router.put('/', upload.single('image'), postController.updatePost);
router.patch('/', postController.patchPost);
router.delete('/', postController.deletePost);

module.exports = router;
