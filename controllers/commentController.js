const asyncHandler = require('../util/asyncHandler');
const ERROR_CODES = require('../exception/errors')
const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const responseFormatter = require('../util/ResponseFormatter');

const validateFields = require('../util/validateFields');


//NOTE: 댓글 목록 조회
exports.getCommentsByPostId = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    validateFields(['postId'], req.body);

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
    const { user_id, post_id, comment } = req.body;

    validateFields(['user_id', 'post_id', 'comment'], req.body);

    const date = new Date().toISOString().slice(0, 10);
    const createComment = await commentModel.createComment(user_id, post_id, comment, date);
    if(!createComment) {
        return res.json(responseFormatter(false, ERROR_CODES.CREATE_COMMENT_ERROR, null));  
    }
    const addReply = await postModel.addReply(post_id);
    if(!addReply){
        return res.json(responseFormatter(false, ERROR_CODES.UPDATE_COMMENT_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'create_comment_success', '댓글 작성이 완료되었습니다'));
});


//NOTE: 댓글 수정
exports.updateComment = asyncHandler(async (req, res, next) => {
    const { user_id, comment_id, content } = req.body;

    validateFields(['user_id', 'comment_id', 'content'], req.body);
    
    const date = new Date().toISOString().slice(0, 10);
    const result = await commentModel.updateComment(content, date, comment_id, user_id);
    if (!result) {
        if(!addReply){
          return res.json(responseFormatter(false, ERROR_CODES.UPDATE_COMMENT_ERROR, null));   
        } 
    }
    return res.json(responseFormatter(true, 'update_comment_success', '댓글 수정이 완료되었습니다'));
});

//NOTE: 댓글 삭제
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { user_id, comment_id, post_id } = req.body;

    validateFields(['user_id', 'comment_id', 'post_id'], req.body);

    const deleteResult = await commentModel.deleteComment(comment_id, user_id);
    if (!deleteResult) {
       return res.json(responseFormatter(false, ERROR_CODES.DELETE_COMMENT_ERROR, null));  
    }

    const discountResult = await postModel.discountComment(post_id);
    if (!discountResult) {
       return res.json(responseFormatter(false, ERROR_CODES.UPDATE_COMMENT_ERROR, null));  
    }

    return res.json(responseFormatter(true, 'delete_comment_success', '댓글 삭제가 완료되었습니다'));
});
