require('dotenv').config();
console.log(process.env.DB_HOST); // 출력 확인
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

connection.connect((err) => {
if (err) {
    console.error('MySQL 연결 오류:', err);
    return;
}
console.log('MySQL 연결 성공');
});

module.exports = connection;