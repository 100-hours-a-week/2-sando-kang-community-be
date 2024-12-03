const mysql = require('mysql2');

// MySQL 연결 풀 생성
var pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    port: process.env.DB_PORT ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log('MySQL 연결 풀 생성 성공');

  // 연결 테스트
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('MySQL 연결 테스트 실패:', err);
      process.exit(1);
    } else {
      console.log('MySQL 연결 테스트 성공');
      connection.release();
    }
  });
} catch (err) {
  console.error('MySQL 연결 풀 생성 실패:', err);
  process.exit(1); // 실패 시 프로세스 종료
}

module.exports = pool.promise();
