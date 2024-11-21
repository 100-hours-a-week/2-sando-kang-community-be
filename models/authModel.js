const connection = require('../db/db');

exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    connection.query(query, [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

exports.findUserById = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE id = ?';
    connection.query(query, [user_id], (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류:', err);
        return reject(err);
      }

      if (results.length === 0) {
        console.error('사용자 찾기 실패');
        return reject(new Error('User not found'));
      }

      resolve(results[0]);
    });
  });
};

exports.createUser = (email, password, nickname, profile) => {
  return new Promise((resolve, reject) => {
    const query =
      'INSERT INTO user (email, password, nickname, profile) VALUES (?, ?, ?, ?)';
    connection.query(query, [email, password, nickname, profile], (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류:', err);
        return reject(err);
      }

      console.log('쿼리 실행 결과:', results);
      resolve(results);
    });
  });
};

exports.deleteUser = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM user WHERE id = ?';
    connection.query(query, [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.updateNickname = (user_id, nickname) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE user SET nickname = ? WHERE id = ?';
    connection.query(query, [nickname, user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.updatePassword = (user_id, password) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE user SET password = ? WHERE id = ?';
    connection.query(query, [password, user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
