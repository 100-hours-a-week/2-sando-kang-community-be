const AppError = require('../exception/AppError');
const asyncHandler = require('../util/asyncHandler');
const ERROR_CODES = require('../exception/errors')
const authModel = require('../models/authModel');
const responseFormatter = require('../util/ResponseFormatter');
const base64 = require('base-64');
const session = require('express-session')

// NOTE: 로그인
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
      throw new AppError(ERROR_CODES.MISSING_FIELDS);
  }

  const encodedPassword = base64.encode(password);
  const user = await authModel.findUserByEmail(email);

  if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND);
  }

  if (encodedPassword !== user.password) {
      throw new AppError(ERROR_CODES.INVALID_PASSWORD);
  }

  // 세션 저장
  req.session.user = {
      user_id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile: user.profile,
  };

  const responseData = {
      user_id: user.id,
      email: user.email,
      nickname: user.nickname,
      profile: user.profile,
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(responseFormatter(true, '요청 성공', responseData));
});

// NOTE: 로그아웃
exports.logout = asyncHandler(async (req, res, next) => {
  req.session.destroy((err) => {
      if (err) {
          throw new AppError(ERROR_CODES.LOGOUT_FAILED);
      }
      res.clearCookie('connect.sid');
      res.json(responseFormatter(true, '요청 성공'));
  });
});

// NOTE: 회원가입
exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password, nickname } = req.body;
  const profile = req.file ? req.file.path : null;

  if (!email || !password || !nickname) {
    throw new AppError(ERROR_CODES.MISSING_FIELDS);
  }

  const encodedPassword = base64.encode(password);
  const createUser = await authModel.createUser(email, encodedPassword, nickname, profile);
  if(!createUser) throw new AppError(ERROR_CODES.CREATE_USER_ERROR);

  req.session.user = { email, nickname, profile };
  res.json(responseFormatter(true, '요청 성공'));
});

// NOTE: 회원 탈퇴
exports.withdraw = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id) {
    throw new AppError(ERROR_CODES.MISSING_FIELDS);
  }

  const deleteUser = await authModel.deleteUser(user_id);
  if(!deleteUser) throw new AppError(ERROR_CODES.DELETE_USER_ERROR);

  res.json(responseFormatter(true, '요청 성공'));
});

// NOTE: 닉네임 수정
exports.updateNickname = asyncHandler(async (req, res, next) => {
  const { user_id, nickname } = req.body;

  if (!user_id || !nickname) {
    throw new AppError(ERROR_CODES.MISSING_FIELDS);
  }

  const updateUser = await authModel.updateNickname(user_id, nickname);
  if(!updateUser) throw new AppError(ERROR_CODES.UPDATE_USER_ERROR);
  
  res.json(responseFormatter(true, '요청 성공'));
});

// NOTE: 비밀번호 수정
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    throw new AppError(ERROR_CODES.MISSING_FIELDS);
  }

  const encodedPassword = base64.encode(password);
  const updatePassword = await authModel.updatePassword(user_id, encodedPassword);
  if(!updatePassword) throw new AppError(ERROR_CODES.UPDATE_PASSWORD_ERROR);

  res.json(responseFormatter(true, '요청 성공'));
});