const AppError = require('../exception/AppError');
const asyncHandler = require('../util/asyncHandler');
const ERROR_CODES = require('../exception/errors')
const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const responseFormatter = require('../util/ResponseFormatter');

//NOTE: 댓글 목록 조회
exports.getCommentsByPostId = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) { 
        throw new AppError(ERROR_CODES.MISSING_FIELDS);
    }

    const comments = await commentModel.getCommentsByPostId(postId); 

    if (!comments || comments.length === 0) {
        throw new AppError(ERROR_CODES.GET_COMMENT_ERROR);
    }

    return res.json({
        success: true,
        message: '요청 성공',
        data: { comments }
    });
});

//NOTE: 댓글 등록
exports.createComment = asyncHandler(async (req, res, next) => {
    const { user_id, post_id, comment, date } = req.body;

    if (!user_id || !post_id || !comment || !date) {
        throw new AppError(ERROR_CODES.MISSING_FIELDS);
    }

    const createComment = await commentModel.createComment(user_id, post_id, comment, date);
    if(!createComment) throw new AppError(ERROR_CODES.CREATE_COMMENT_ERROR);

    const addReply = await postModel.addReply(post_id);
    if(!addReply) throw new AppError(ERROR_CODES.UPDATE_COMMENT_ERROR);

    res.json(responseFormatter(true, '요청 성공'));
});


//NOTE: 댓글 수정
exports.updateComment = asyncHandler(async (req, res, next) => {
    const { comment_id, content } = req.body;

    if (!comment_id || !content) {
        throw new AppError(ERROR_CODES.MISSING_FIELDS);
    }

    const result = await commentModel.updateComment(comment_id, content);
    if (!result) {
        if(!addReply) throw new AppError(ERROR_CODES.UPDATE_COMMENT_ERROR);
    }

    res.json(responseFormatter(true, '요청 성공'));
});

//NOTE: 댓글 삭제
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { comment, post_id } = req.body;

    if (!comment || !post_id) {
        throw new AppError(ERROR_CODES.MISSING_FIELDS);
    }

    const deleteResult = await commentModel.deleteComment(comment);
    if (!deleteResult) {
        throw new AppError(ERROR_CODES.DELETE_COMMENT_ERROR);
    }

    const discountResult = await postModel.discountComment(post_id);
    if (!discountResult) {
        throw new AppError(ERROR_CODES.UPDATE_COMMENT_ERROR);
    }

    res.json(responseFormatter(true, '요청 성공'));
});
