const connection = require('../db/db');

// NOTE: 이메일로 사용자 찾기
exports.findUserByEmail = async (email) => {
  const query = 'SELECT * FROM user WHERE email = ?';
  try {
    const [rows] = await connection.query(query, [email]);
    return rows[0] || null; 
  } catch (error) {
    console.error('Database Error (findUserByEmail):', error.message);
    throw error; 
  }
};

// NOTE: 사용자 ID로 사용자 찾기
exports.findUserById = async (user_id) => {
  const query = 'SELECT * FROM user WHERE id = ?';
  try {
    const [rows] = await connection.query(query, [user_id]);
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    return rows[0];
  } catch (error) {
    console.error('Database Error (findUserById):', error.message);
    throw error;
  }
};

// NOTE: 사용자 생성
exports.createUser = async (email, password, nickname, profile) => {
  const query = `INSERT INTO user (email, password, nickname, profile) VALUES (?, ?, ?, ?)`;
  try {
    const [result] = await connection.query(query, [email, password, nickname, profile]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Database Insert Error (createUser):', error.message);
    throw error;
  }
};

// NOTE: 사용자 삭제
exports.deleteUser = async (user_id) => {
  const query = 'DELETE FROM user WHERE id = ?';
  try {
    const [result] = await connection.query(query, [user_id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Database Delete Error (deleteUser):', error.message);
    throw error;
  }
};

// NOTE: 닉네임 업데이트
exports.updateNickname = async (user_id, nickname, profile) => {
  const query = 'UPDATE user SET nickname = ? , profile = ? WHERE id = ?';
  try {
    const [result] = await connection.query(query, [nickname, profile, user_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Database Update Error (updateNickname):', error.message);
    throw error;
  }
};

// NOTE: 비밀번호 업데이트
exports.updatePassword = async (user_id, password) => {
  const query = 'UPDATE user SET password = ? WHERE id = ?';
  try {
    const [result] = await connection.query(query, [password, user_id]);
    return result.affectedRows > 0; 
  } catch (error) {
    console.error('Database Update Error (updatePassword):', error.message);
    throw error;
  }
};
