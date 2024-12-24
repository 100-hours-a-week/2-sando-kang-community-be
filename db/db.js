const mysql = require('mysql2');
//local 실행
require('dotenv').config({ path: '.env.local' }); 

console.log('DB_HOST:', process.env.DB_HOST ? '******' : 'not set');
console.log('DB_USER:', process.env.DB_USER ? '******' : 'not set');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'not set');
console.log('DB_NAME:', process.env.DB_NAME ? '******' : 'not set');
console.log('DB_PORT:', process.env.DB_PORT || 3306 ? '******' : 'not set');

var pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log('MySQL 연결 풀 생성 성공');

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('MySQL 연결 실패:', err);
      process.exit(1);
    } else {
      console.log('MySQL 연결 성공');
      connection.release();
    }
  });
} catch (err) {
  console.error('MySQL 연결 풀 생성 실패:', err);
  process.exit(1);
}

module.exports = pool.promise();
