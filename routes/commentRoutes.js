const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticateJWT = require('../security/authenticateJWT'); 

router.get('/:postId', commentController.getCommentsByPostId);

router.post('/', authenticateJWT, commentController.createComment);
router.put('/', authenticateJWT, commentController.updateComment);
router.delete('/', authenticateJWT, commentController.deleteComment);

module.exports = router;
