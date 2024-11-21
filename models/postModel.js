const connection = require('../db/db');

// NOTE: 게시글 목록 조회
exports.getPaginatedPosts = (startIndex, pageSize) => {
    const query = `
        SELECT 
            post.id,
            user.nickname AS author,
            user.profile AS profile,
            post.title,
            post.content,
            post.image,
            post.date,
            post.likes,
            post.views,
            post.comments 
        FROM 
            post 
        JOIN
            user ON post.user_id = user.id
        ORDER BY date DESC 
        LIMIT ?, ?
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, [startIndex, pageSize], (err, results) => {
            if (err) return reject(`server error : ${err}`);
            resolve(results);
        });
    });
};

// NOTE: 게시글 작성
exports.createPost = (user_id, title, content, image, date) => {
    const query = 'INSERT INTO post (user_id, title, content, image, date, likes, views, comments) VALUES (?, ?, ?, ?, ?, 0, 1, 0)';
    return new Promise((resolve, reject) => {
        connection.query(query, [user_id, title, content, image, date], (err, results) => {
            if (err) return reject(err);
            resolve(results.insertId);
        });
    });
};

// NOTE: 특정 게시글 조회
exports.getPostById = (postId) => {
    const query = `SELECT id, title, content, user_id, image, date, likes, views, comments FROM post WHERE id = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [postId], (err, results) => {
            if (err) return reject(`getPostById error : ${err}`);
            if (results.length === 0) return reject(`No post found with id: ${postId}`);
            resolve(results[0]);
        });
    });
};

// NOTE: 게시글 수정
exports.updatePost = (user_id, post_id, title, content, image, date) => {
    const query = `UPDATE post SET title = ?, content = ?, image = ?, date = ? WHERE user_id = ? AND id = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [title, content, image, date, user_id, post_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// NOTE: 게시글 삭제
exports.deletePost = (post_id) => {
    const query = `DELETE FROM post WHERE id = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [post_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// NOTE: 댓글 추가
exports.addReply = (post_id) => {
    const query = `UPDATE post SET comments = comments + 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [post_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// NOTE: 댓글 감소
exports.discountComment = (post_id) => {
    const query = `UPDATE post SET comments = comments - 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [post_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// NOTE: 게시글 좋아요
exports.patchPost = (post_id) => {
    console.log(`id : ${post_id}`)
    const query = `UPDATE post SET likes = likes + 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
        connection.query(query, [post_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
