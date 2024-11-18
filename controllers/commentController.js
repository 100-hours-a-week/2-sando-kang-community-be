const commentModel = require('../models/commentModel');
const postModel = require('../models/postModel');
const responseFormatter = require('../util/ResponseFormatter');

//NOTE: 댓글 목록 조회
exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;


    if (!postId) { 
        return res.status(400).json({
            success: false,
            message: 'missing_post_id'
        });
    }

    try {
        const comments = await commentModel.getCommentsByPostId(postId); 

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'no_comments_found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'comment_get_success',
            data: { comments }
        });
    } catch (err) {

        console.error('댓글 조회 오류:', err);
        return res.status(500).json({
            success: false,
            message: 'server_error'
        });
    }
};

//NOTE: 댓글 등록
exports.createComment = (req, res) => {
    const { user_id, post_id, comment, date } = req.body;

    if (!user_id || !post_id || !comment || !date) {
        return res.status(400).json(responseFormatter(false, 'invalid_request'));
    }

    commentModel.createComment(user_id, post_id, comment, date, (err, result) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        }

        postModel.addReply(post_id, (err) => {
            if (err) {
                console.error('댓글 수 업데이트 중 오류 발생:', err);
                return res.status(500).json(responseFormatter(false, 'server_error'));
            }
            
            res.json(responseFormatter(true, 'register_success'));
        });
    });
};


//NOTE: 댓글 수정
exports.updateComment = (req, res) => {
    const { comment_id, content } = req.body;

    console.log(`comment_id  : ${comment_id}`);
    console.log(`content  : ${content}`);

    commentModel.updateComment(comment_id, content, (err, result) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        }
        res.json(responseFormatter(true, 'update_success'));
    });
};



//NOTE: 댓글 삭제
exports.deleteComment = (req, res) => {
    const { comment, post_id } = req.body;

    commentModel.deleteComment(comment, (err, result) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, '1 server_error'));
        }
        
        // 댓글 삭제가 성공적으로 완료된 후, 게시글의 댓글 수를 감소
        postModel.discountComment(post_id, (err, result) => {
            if (err) {
                return res.status(500).json(responseFormatter(false, '2 server_error'));
            }

            // 모든 작업이 성공적으로 완료되면 최종 응답 전송
            res.json(responseFormatter(true, 'update_success'));
        });
    });
};
