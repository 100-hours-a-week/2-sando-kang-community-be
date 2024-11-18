const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:postId', commentController.getCommentsByPostId);
router.post('/', commentController.createComment);
router.put('/', commentController.updateComment);
router.delete('/', commentController.deleteComment);

module.exports = router;
