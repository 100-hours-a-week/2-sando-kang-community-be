#!/bin/bash

echo "Instance startup script executed at $(date)"

# 기존 Node.js 프로세스 종료
pkill -f 'node app.js' || true

# 기존 프로세스 종료
pm2 stop all || true

# 애플리케이션 디렉토리 이동
cd /home/ubuntu/2-sando-kang-community-be

# 의존성 설치
npm install

# 애플리케이션 실행
sh ./start.sh

# Nginx 재시작
sudo systemctl restart nginx

echo "Application started successfully"