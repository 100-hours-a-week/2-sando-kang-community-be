const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 댓글 목록 조회 (특정 게시글의 댓글을 가져오는 API)
router.get('/:postId', commentController.getCommentsByPostId);

// 댓글 작성 API
router.post('/', commentController.createComment);

// 댓글 수정 API (추후 추가 가능)
router.put('/', commentController.updateComment);

// 댓글 삭제 API (추후 추가 가능)
router.delete('/', commentController.deleteComment);

module.exports = router;
