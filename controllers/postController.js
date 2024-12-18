const asyncHandler = require('../util/asyncHandler');
const ERROR_CODES = require('../exception/errors')
const responseFormatter = require('../util/ResponseFormatter');
const { handleImageProcessing } = require('../util/s3ImageHandler');
const postModel = require('../models/postModel');
const authModel = require('../models/authModel');
const commentModel = require('../models/commentModel');
const likesModel = require('../models/likesModel');

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
            imageUrl = postData[i].profile ? `${postData[i].profile}` : null;
            postData[i].profile = imageUrl;
        }
        if(postData[i].image){
            imageUrl = postData[i].image ? `${postData[i].image}` : null;
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

    validateFields(['postId'], req.params);

    const post = await postModel.getPostById(postId);
    if (!post) {
        return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, null));  
    }

    const user = await authModel.findUserById(post.user_id);
    const author = user ? user.nickname : 'Unknown';
   
    const comments = await commentModel.findCommentsByPostId(postId);
    const formattedComments = comments.map((comment) => ({
        id: comment.id,
        user_id: comment.user_id,
        content: comment.comment,
        author: comment.author || 'Unknown',
        date: comment.date,
    }));

    let profileUrl = null;
    if (user.profile) {
        profileUrl = user.profile ? `${user.profile}` : null;
    }

    let imageUrl = null;
    if (post.image) {
        imageUrl = post.image ? `${post.image}` : null;
    }

    const postData = {
        post_id: post.id,
        user_id: user.id,
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
    console.log(`이미지: ${image}`);
    const date = new Date().toISOString().slice(0, 10);
    validateFields(['user_id', 'title' , 'content'], req.body);

    let postUrl = null;
    if (req.file && req.file.buffer) {
        postUrl = await handleImageProcessing(req.file.buffer, req.file.originalname);
    }

    const postId = await postModel.createPost(user_id, title, content, postUrl, date);
    if (!postId) {
        return res.json(responseFormatter(false, ERROR_CODES.CREATE_POST_ERROR, null));  
    }
    return res.json(responseFormatter(true, 'create_post_success', { postId }));
});


//NOTE: 게시글 수정
exports.updatePost = asyncHandler(async (req, res, next) => {
    const { user_id, post_id, title, content, date } = req.body;

    console.log(`user_id: ${user_id}`);
    console.log(`post_id: ${post_id}`);
    console.log(`title: ${title}`);
    console.log(`content: ${content}`);
    console.log(`date: ${date}`);

    let postUrl = null;
    if (req.file && req.file.buffer) {
        postUrl = await handleImageProcessing(req.file.buffer, req.file.originalname);
    }else{
        postUrl = null;
    }

    console.log(`post url : ${postUrl}`)

    validateFields(['user_id', 'post_id', 'title', 'content', 'date'], req.body);

    const post = await postModel.getPostById(post_id);

    if (post.user_id != user_id ) return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, '해당 게시글을 작성한 사람만 수정 또는 삭제할 수 있습니다.'));  

    if (post == null)  return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, null));  
    
    const result = await postModel.updatePost(user_id, post_id, title, content, postUrl, date);
    if (!result) {
        return res.json(responseFormatter(false, ERROR_CODES.UPDATE_POST_ERROR, null));  
    }

    return res.json(responseFormatter(true, 'update_post_success', '게시물 수정이 완료되었습니다'));
});

// NOTE: 게시글 삭제
exports.deletePost = asyncHandler(async (req, res, next) => {
    const { user_id, post_id } = req.body;

    validateFields(['user_id', 'post_id'], req.body);

    const post = await postModel.getPostById(post_id);
    
    if(post.user_id != user_id) return res.json(responseFormatter(false, ERROR_CODES.GET_POST_ERROR, '해당 게시글을 작성한 사람만 수정 또는 삭제할 수 있습니다.'));  

    const postResult = await postModel.deletePost(post_id);
    const likesResult = await likesModel.dropLikes(user_id, post_id);

    if (!postResult) return res.json(responseFormatter(false, ERROR_CODES.DELETE_POST_ERROR, '게시물 삭제 실패입니다'));
    if (!likesResult) return res.json(responseFormatter(false, ERROR_CODES.DELETE_COMMENT_ERROR, '좋아요 감소 실패입니다'));    
    
    await commentModel.deleteCommentByPostId(post_id);
    
    return res.json(responseFormatter(true, 'delete_post_success', '게시물 삭제가 완료되었습니다'));
});

// NOTE: 게시글 좋아요+1
exports.patchPost = asyncHandler(async (req, res, next) => {
    const { user_id, post_id } = req.body;

    validateFields(['user_id','post_id'], req.body);

    // validate likes duplication
    const likes = await likesModel.validateLikes(user_id, post_id);
    if (likes.length > 0) return res.json(responseFormatter(false, ERROR_CODES.UPDATE_POST_ERROR, '한 게시물에 하나의 좋아요만 가능합니다'));  
    else{
        const patchPostResult = await postModel.patchPost(post_id);
        const patchLikesResult = await likesModel.addLikes(user_id, post_id);

        if (!patchPostResult) {
            return res.json(responseFormatter(false, ERROR_CODES.UPDATE_POST_ERROR, '게시물 수정 실패입니다'));  
        }

        if (!patchLikesResult) {
            return res.json(responseFormatter(false, ERROR_CODES.UPDATE_POST_ERROR, '좋아요 추가 실패입니다'));  
        }

        return res.json(responseFormatter(true, 'update_post_success', '좋아요를 눌렀습니다'));
    }
  
});
