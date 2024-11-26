// 환경 파일 로드
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

const mysql = require('mysql2');

// 디버그용 로그: 현재 환경 및 DB 설정 출력
console.log('Current Environment:', process.env.NODE_ENV || 'local');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // 기본값: localhost
  user: process.env.DB_USER || 'root',      // 기본값: root
  password: process.env.DB_PASSWORD || '',  // 기본값: 빈 문자열
  database: process.env.DB_NAME || 'test',  // 기본값: test
  port: process.env.DB_PORT || 3306,        // 기본값: 3306
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0, 
});

module.exports = pool.promise();
