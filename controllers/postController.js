const asyncHandler = require('../util/asyncHandler');
const ERROR_CODES = require('../exception/errors')
const responseFormatter = require('../util/ResponseFormatter');
const postModel = require('../models/postModel');
const authModel = require('../models/authModel');
const commentModel = require('../models/commentModel');

const validateFields = require('../util/validateFields');

//NOTE: posts.js 연동 - 게시글 목록 조회
exports.getPosts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const startIndex = (page - 1) * pageSize;

    console.log(`pagesize : ${pageSize}`);
    console.log(`startIndex : ${startIndex}`);

    const postData = await postModel.getPaginatedPosts(startIndex, pageSize);

    for(i = 0 ; i < postData.length ; i++){
        if(postData[i].profile){
            const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
            imageUrl = postData[i].profile ? `${baseUrl}/${postData[i].profile}` : null;
            postData[i].profile = imageUrl;
        }
        if(postData[i].image){
            const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
            imageUrl = postData[i].image ? `${baseUrl}/${postData[i].image}` : null;
            postData[i].image = imageUrl;
        }
    }

    if (!postData) {
        return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, null));
    }

    // 데이터가 없으면 success와 함께 빈 배열로 응답
    const hasMore = postData.length === pageSize; // 남은 게시물이 있는지 여부
    return res.json(responseFormatter(true, 'get_posts_success', { postData, hasMore }));
});



//NOTE: 게시글 + 댓글 조회
exports.getPostsById = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    validateFields(['postId'], req.body);

    const post = await postModel.getPostById(postId);
    if (!post) {
        return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, null));  
    }

    const user = await authModel.findUserById(post.user_id);
    const author = user ? user.nickname : 'Unknown';
   
    const comments = await commentModel.findCommentsByPostId(postId);
    const formattedComments = comments.map((comment) => ({
        id: comment.id,
        content: comment.comment,
        author: comment.author || 'Unknown',
        date: comment.date,
    }));

    let profileUrl = null;
    if (user.profile) {
        const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
        profileUrl = user.profile ? `${baseUrl}/${user.profile}` : null;
    }

    let imageUrl = null;
    if (post.image) {
        const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
        imageUrl = post.image ? `${baseUrl}/${post.image}` : null;
    }

    const postData = {
        post_id: post.id,
        title: post.title,
        content: post.content,
        updatePostDate: post.date,
        image: imageUrl,
        author: author,
        profile: profileUrl,
        likesCnt: post.likes,
        viewsCnt: post.views,
        commentsCnt: post.comments,
        comment: formattedComments,
    };
    console.log(postData)
    return res.json(responseFormatter(true, 'get_posts_succcess', { postData }));
});

//NOTE: 게시글 작성
exports.createPost = asyncHandler(async (req, res, next) => {
    const { user_id, title, content } = req.body;
    const image = req.file ? req.file.path : null;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    validateFields(['user_id', 'title' , 'content'], req.body);

    const postId = await postModel.createPost(user_id, title, content, image, date);
    if (!postId) {
        return res.json(responseFormatter(false, ERROR_CODES.CREATE_POST_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'create_post_success', { postId }));
});

//NOTE: 특정 게시글 조회
exports.getPostById = asyncHandler(async (req, res, next) => {
    const { user_id, post_id } = req.query;

    validateFields(['user_id', 'post_id'], req.body);

    const post = await postModel.getPostById(user_id, post_id);
    if (!post || !post.length) {
        return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'get_post_success', { post: post[0] }));
});

//NOTE: 게시글 수정
exports.updatePost = asyncHandler(async (req, res, next) => {
    const { user_id, post_id, title, content, date } = req.body;
    const image = req.file ? req.file.path : null;

    validateFields(['user_id', 'post_id', 'title', 'content', 'date'], req.body);

    const post = await postModel.findPostByUserId(user_id);
    if (post == null)  return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, null));  
    
    const result = await postModel.updatePost(user_id, post_id, title, content, image, date);
    if (!result) {
        return res.json(responseFormatter(false, ERROR_CODES.UPDATE_POST_ERROR, null));  
    }

    return res.json(responseFormatter(true, 'update_post_success'));
});

// NOTE: 게시글 삭제
exports.deletePost = asyncHandler(async (req, res, next) => {
    const { post_id } = req.body;

    validateFields(['post_id'], req.body);

    const postResult = await postModel.deletePost(post_id);
    if (!postResult) {
        return res.json(responseFormatter(false, ERROR_CODES.DELETE_POST_ERROR, null));  
    }

    const commentResult = await commentModel.deleteCommentByPostId(post_id);
    if (!commentResult) {
        return res.json(responseFormatter(false, ERROR_CODES.DELETE_POST_COMMENT_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'delete_post_success'));
});

// NOTE: 게시글 좋아요+1
exports.patchPost = asyncHandler(async (req, res, next) => {
    const { post_id } = req.body;

    validateFields(['post_id'], req.body);

    const result = await postModel.patchPost(post_id);
    if (!result) {
        return res.json(responseFormatter(false, ERROR_CODES.UPDATE_POST_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'update_post_success'));
});
