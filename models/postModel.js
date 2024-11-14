const connection = require('../db/db')

// NOTE: 게시글 목록 조회
exports.getPaginatedPosts = (startIndex, pageSize, callback) => {
    const query = `SELECT * FROM post ORDER BY date DESC LIMIT ?, ?`;
    connection.query(query, [startIndex, pageSize], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// NOTE: 게시글 작성
exports.createPost = (user_id, title, content, image, date, callback) => {
    const query = 'INSERT INTO post (user_id, title, content, image, date, likes, views, comments) VALUES (?, ?, ?, ?, ?, 1,1,1)';
    connection.query(query, [user_id, title, content, image, date], (err, results) => {
        if (err) return callback(err);
        callback(null, results.insertId);
    });
};

// NOTE: 특정 게시글 조회
exports.getPostById = (postId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT id, title, content, user_id, image, date, likes, views, comments FROM post WHERE id = ?`;
        connection.query(query, [postId], (err, results) => {
            if (err) {
                return reject(`getPostById error : ${err}`); 
            }
            if (results.length === 0) {
                return reject(`No post found with id: ${postId}`); 
            }
            resolve(results[0]); 
        });
    });
};

// NOTE: 게시글 수정
exports.updatePost = (user_id, post_id, title, content, image, date,  callback) => {
    const query = `UPDATE post SET title = ?, content = ?, image = ? , date = ? WHERE user_id = ? AND id = ?`;
    connection.query(query, [title, content, image, date, user_id, post_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// NOTE: 게시글 삭제
exports.deletePost = (post_id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM post WHERE id = ?`;
        
        connection.query(query, [post_id], (err, results) => {
            if (err) {
                reject(err);  // 에러 발생 시 reject 호출
            } else {
                resolve(results);  // 성공 시 resolve 호출
            }
        });
    });
};

// NOTE: 댓글 추가
exports.addReply = (post_id, callback) => {
    const query = `UPDATE post SET comments = comments + 1 WHERE id = ?`;
    
    connection.query(query, [post_id], (err, results) => {
        if (err) {
            console.error('댓글 수 업데이트 중 오류 발생:', err);
            return callback(err);
        }
        callback(null, results);
    });
};

// NOTE: 게시글 수정
exports.discountComment = (post_id, callback) => {
    const query = `UPDATE post SET comments = comments-1 WHERE  id = ?`;
    connection.query(query, [post_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// NOTE: 게시글 좋아요
exports.patchPost = (post_id, callback) => {
    const query = `UPDATE post SET likes = likes + 1 WHERE id = ?`;
    connection.query(query, [post_id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};