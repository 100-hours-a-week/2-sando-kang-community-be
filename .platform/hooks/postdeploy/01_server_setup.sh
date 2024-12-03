#!/bin/bash

# 기존 Node.js 프로세스 종료
pkill -f 'node app.js' || true

# 애플리케이션 디렉토리 이동
cd /home/ubuntu/2-sando-kang-community-be

# 의존성 설치
npm install

# .env.dev 파일 생성
cat <<EOL > .env.dev
BASE_URL=http://43.202.140.0:3000

DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT
EOL

# .env.dev 파일 권한 설정 (관리자와 작성자만 읽기/쓰기/실행 가능)
chmod 600 .env.dev

# 애플리케이션 실행
sh ./start.sh

# Nginx 재시작
sudo systemctl restart nginx
