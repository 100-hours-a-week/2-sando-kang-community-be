const asyncHandler = require('../util/asyncHandler');
const ERROR_CODES = require('../exception/errors')
const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const responseFormatter = require('../util/ResponseFormatter');

//NOTE: 댓글 목록 조회
exports.getCommentsByPostId = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    for (const key in req.body) {
        if (!req.body[key]) {
            return res.json(responseFormatter(false, ERROR_CODES.MISSING_FIELDS(key), null));
        }
    }

    const comments = await commentModel.getCommentsByPostId(postId); 

    if (!comments || comments.length === 0) {
       return res.json(responseFormatter(false, ERROR_CODES.GET_COMMENT_ERROR, null));  
    }

    return res.json({
        success: true,
        message: 'get_comments_success',
        data: { comments }
    });
});

//NOTE: 댓글 등록
exports.createComment = asyncHandler(async (req, res, next) => {
    const { user_id, post_id, comment, date } = req.body;

    for (const key in req.body) {
    if (!req.body[key]) {
        return res.json(responseFormatter(false, ERROR_CODES.MISSING_FIELDS(key), null));
        }
    }

    const createComment = await commentModel.createComment(user_id, post_id, comment, date);
    if(!createComment) {
        return res.json(responseFormatter(false, ERROR_CODES.CREATE_COMMENT_ERROR, null));  
    }
    const addReply = await postModel.addReply(post_id);
    if(!addReply){
        return res.json(responseFormatter(false, ERROR_CODES.UPDATE_COMMENT_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'create_comment_success'));
});


//NOTE: 댓글 수정
exports.updateComment = asyncHandler(async (req, res, next) => {
    const { comment_id, content } = req.body;

    for (const key in req.body) {
        if (!req.body[key]) {
            return res.json(responseFormatter(false, ERROR_CODES.MISSING_FIELDS(key), null));
        }
    }

    const result = await commentModel.updateComment(comment_id, content);
    if (!result) {
        if(!addReply){
          return res.json(responseFormatter(false, ERROR_CODES.UPDATE_COMMENT_ERROR, null));   
        } 
    }
    return res.json(responseFormatter(true, 'update_comment_success'));
});

//NOTE: 댓글 삭제
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { comment, post_id } = req.body;

    for (const key in req.body) {
        if (!req.body[key]) {
            return res.json(responseFormatter(false, ERROR_CODES.MISSING_FIELDS(key), null));
        }
    }

    const deleteResult = await commentModel.deleteComment(comment);
    if (!deleteResult) {
       return res.json(responseFormatter(false, ERROR_CODES.DELETE_COMMENT_ERROR, null));  
    }

    const discountResult = await postModel.discountComment(post_id);
    if (!discountResult) {
       return res.json(responseFormatter(false, ERROR_CODES.UPDATE_COMMENT_ERROR, null));  
    }

    return res.json(responseFormatter(true, 'delete_comment_success'));
});
