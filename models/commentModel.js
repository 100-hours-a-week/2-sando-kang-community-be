const connection = require('../db/db');

// NOTE: 댓글 검증
exports.validateComments = async (user_id, comment_id) => {
  const query = `SELECT * FROM comment WHERE user_id = ? AND id = ?`;
  try {
    const [result] = await connection.query(query, [user_id, comment_id]);
    return result; 
  } catch (error) {
    console.error('Error validating comments:', error.message);
    throw error;
  }
};


// NOTE: 게시글 ID로 댓글 조회
exports.findCommentsByPostId = async (postId) => {
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

  try {
    const [rows] = await connection.query(query, [postId]);
    if (rows.length === 0) {
      console.log('No comments found for post ID:', postId);
    }
    return rows;
  } catch (error) {
    console.error('Error fetching comments by post ID:', error.message);
    throw error;
  }
};

// NOTE: 댓글 작성
exports.createComment = async (user_id, post_id, comment, date) => {
  const query = `INSERT INTO comment (user_id, post_id, comment, date) VALUES (?, ?, ?, ?)`;

  try {
    const [result] = await connection.query(query, [user_id, post_id, comment, date]);
    return result.insertId;
  } catch (error) {
    console.error('Error creating comment:', error.message);
    throw error;
  }
};

// NOTE: 댓글 수정
exports.updateComment = async (comment_id, content) => {
  const query = `UPDATE comment SET comment = ? WHERE id = ?`;

  try {
    const [result] = await connection.query(query, [content, comment_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error updating comment:', error.message);
    throw error;
  }
};

// NOTE: 댓글 삭제
exports.deleteComment = async (comment_id) => {
  const query = 'DELETE FROM comment WHERE id = ?';

  try {
    const [result] = await connection.query(query, [comment_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    throw error;
  }
};

// NOTE: 특정 게시글의 모든 댓글 삭제
exports.deleteCommentByPostId = async (post_id) => {
  const query = `DELETE FROM comment WHERE post_id = ?`;

  try {
    const [result] = await connection.query(query, [post_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Error deleting comments by post ID:', error.message);
    throw error;
  }
};
