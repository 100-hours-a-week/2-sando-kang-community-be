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

exports.createComment = (user_id, post_id, comment, date) => {
    const query = `INSERT INTO comment (user_id, post_id, comment, date) VALUES (?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        connection.query(query, [user_id, post_id, comment, date], (err, results) => {
            if (err) {
                console.error('댓글 작성 중 오류 발생:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

exports.updateComment = (comment_id, content) => {
    const query = `UPDATE comment SET comment = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
        connection.query(query, [content, comment_id], (err, results) => {
            if (err) {
                console.error('댓글 수정 중 오류 발생:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

exports.deleteComment = (comment_id) => {
    const query = `DELETE FROM comment WHERE id = ?`;

    return new Promise((resolve, reject) => {
        connection.query(query, [comment_id], (err, results) => {
            if (err) {
                console.error('댓글 삭제 중 오류 발생:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

exports.deleteCommentByPostId = (post_id) => {
    const query = `DELETE FROM comment WHERE post_id = ?`;

    return new Promise((resolve, reject) => {
        connection.query(query, [post_id], (err, results) => {
            if (err) {
                console.error('댓글 삭제 중 오류 발생:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};
