#!/bin/bash

echo "Instance startup script executed at $(date)" >> /var/log/startup.log

# PM2 설치 확인 및 설치
if ! command -v pm2 &> /dev/null; then
    echo "pm2 not found, installing..."
    sudo npm install -g pm2
fi

# 기존 PM2 프로세스 종료
echo "Stopping existing PM2 processes..." >> /var/log/startup.log
pm2 stop all || true
pm2 delete all || true

# 의존성 설치
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..." >> /var/log/startup.log
    npm install
else
    echo "Dependencies already installed. Skipping 'npm install'..." >> /var/log/startup.log
fi

# 애플리케이션 실행
echo "Starting application using PM2..." >> /var/log/startup.log
pm2 start dist/main.cjs --name "my-app"

# Nginx 재시작
echo "Restarting Nginx..." >> /var/log/startup.log
sudo systemctl restart nginx

echo "Application started successfully at $(date)" >> /var/log/startup.log