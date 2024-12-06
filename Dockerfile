# Node.js의 최신 LTS 버전을 기반 이미지로 사용
FROM node:22

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /usr/src/app

# 애플리케이션의 의존성 파일 복사
COPY package*.json ./

# 의존성 설치 (npm install 또는 yarn 사용 가능)
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 기본 환경 변수 설정 (필요 시 덮어쓰기 가능)
ENV PORT=3000
ENV NODE_ENV=production

# 애플리케이션이 사용하는 포트
EXPOSE 3000

# 애플리케이션 실행 명령어
CMD ["npm", "start"]
