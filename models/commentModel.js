const connection = require('../db/db');

exports.findCommentsByPostId = (postId) => {
    const query = `
        SELECT 
            comment.id, 
            comment.comment, 
            user.nickname AS author, 
            comment.date
        FROM 
            comment
        JOIN 
            user ON comment.user_id = user.id
        WHERE 
            comment.post_id = ?
        ORDER BY 
            comment.date DESC
    `;
    
    // Promise로 반환하여 async/await 방식으로 처리
    return new Promise((resolve, reject) => {
        connection.query(query, [postId], (err, results) => {
            if (err) {
                console.error('댓글 조회 중 오류 발생:', err);
                return reject(err); 
            }

            if (results.length === 0) {
                console.log('댓글이 없습니다.');
                return resolve([]); 
            }

            resolve(results);
        });
    });
};


exports.createComment = (user_id, post_id, comment, date, callback) => {
    const query = `INSERT INTO comment (user_id, post_id, comment, date) VALUES (?, ?, ?, ?)`;
    
    connection.query(query, [user_id, post_id, comment, date], (err, results) => {
        if (err) {
            console.error('댓글 작성 중 오류 발생:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

exports.updateComment = (comment_id, content, callback) => {
    const query = `UPDATE comment SET comment = ? WHERE id = ? `;
    
    connection.query(query, [content, comment_id], (err, results) => {
        if (err) {
            console.error('댓글 수정 중 오류 발생:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

exports.deleteComment = (comment_id, callback) => {
    console.log(`id : ${comment_id}`)
    const query = `DELETE FROM comment WHERE id = ?`;
    
    connection.query(query, [comment_id], (err, results) => {
        if (err) {
            console.error('댓글 삭제 중 오류 발생:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


// NOTE: 댓글 삭제 (게시글에 대한 댓글 삭제)
exports.deleteCommentByPostId = (post_id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM comment WHERE post_id = ?`;
        
        connection.query(query, [post_id], (err, results) => {
            if (err) {
                console.error('댓글 삭제 중 오류 발생:', err);
                reject(err);  // 에러 발생 시 reject 호출
            } else {
                resolve(results);  // 성공 시 resolve 호출
            }
        });
    });
};
