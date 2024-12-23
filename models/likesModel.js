const connection = require('../db/db');

// TODO: JWT
// NOTE: 좋아요 검증(중복 방지)
exports.validateLikes = async (user_id, post_id) => {
  const query = `SELECT * FROM likes WHERE user_id = ? AND post_id = ?`;
  try {
    const [result] = await connection.query(query, [user_id, post_id]);
    return result; 
  } catch (error) {
    console.error('Error validating likes:', error.message);
    throw error;
  }
};

// TODO: JWT
// NOTE: 좋아요 추가
exports.addLikes = async (user_id, post_id) => {
    const query = `INSERT INTO likes (user_id, post_id) 
                   VALUES (?, ?)`;
    try {
      const [result] = await connection.query(query, [user_id, post_id]);
      return result.insertId; 
    } catch (error) {
      console.error('Error adding likes:', error.message);
      throw error;
    }
};

// TODO: JWT
// NOTE: 좋아요 삭제
exports.dropLikes = async (user_id, post_id) => {
const query = `DELETE FROM likes WHERE user_id =? and post_id = ?`;
try {
    const [result] = await connection.query(query, [user_id, post_id]);
    return result; 
} catch (error) {
    console.error('Error delete likes:', error.message);
    throw error;
}
};
  
