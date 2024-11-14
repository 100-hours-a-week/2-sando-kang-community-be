const express = require('express');
const timeout = require('connect-timeout');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const moment = require('moment-timezone');
const rotatingFileStream = require('rotating-file-stream');
const fs = require('fs');

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, 
  message: 'api 과다 요청 발생. 5분 뒤에 다시 요청하세요',
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Routers
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');

// log file
morgan.token('date', (request, response, timezone) => {
  return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');  // 시간대 서울로 설정
});

const logDirectory = path.join(__dirname, 'log');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = rotatingFileStream.createStream('access.log', {
  interval: '1d', // 1일 단위로 파일 회전
  path: logDirectory, // 로그 파일 경로 설정
});

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[Asia/Seoul]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    { stream: accessLogStream }
  )
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(timeout('15s'));
app.use(haltOnTimedout); 
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helmet 설정: Content Security Policy 활성화
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // 기본적으로 모든 리소스는 동일 출처에서만 로드
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 스크립트는 동일 출처 또는 인라인/평가 가능
        styleSrc: ["'self'", "'unsafe-inline'"], // 스타일은 동일 출처 또는 인라인 가능
        imgSrc: ["'self'", "data:", "https://*.example.com"], // 이미지 리소스는 동일 출처 또는 data URI 허용
        fontSrc: ["'self'"], // 폰트 리소스는 동일 출처에서만 로드
        connectSrc: ["'self'"], // Ajax, WebSocket 등의 연결은 동일 출처에서만 가능
        objectSrc: ["'none'"], // 플러그인 객체는 사용하지 않음
        upgradeInsecureRequests: [], // HTTP를 HTTPS로 자동 업그레이드
      },
    },
  })
);

app.use(session({
  secret: 'my_secret_key', 
  resave: false, 
  saveUninitialized: false, 
  cookie: { secure: false } 
}));

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms', 'terms.html'));
});
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms', 'privacy.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
