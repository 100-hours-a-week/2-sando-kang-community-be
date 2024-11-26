#!/bin/bash

# 환경 변수 설정
export NODE_ENV=dev

# 서버 실행
pm2 start app.js --name "my-app" --env dev
