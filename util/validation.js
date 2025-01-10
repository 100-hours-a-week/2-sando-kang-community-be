const ERROR_CODES = require('../exception/errors');
const { findUserByEmail, checkNicknameExists } = require('../models/authModel');
const responseFormatter = require('./ResponseFormatter');

// 이메일 형식 검증
const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return responseFormatter(false, ERROR_CODES.MISSING_FIELDS('email'), '이메일 형식이 올바르지 않습니다.');
    }
    return responseFormatter(true, null, '이메일 형식 검증 성공');
  };
  
  // 이메일 존재 여부 확인
  const validateEmailExists = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
      return responseFormatter(false, ERROR_CODES.USER_NOT_FOUND, '가입된 계정을 찾을 수 없습니다.');
    }
    return responseFormatter(true, null, '이메일 존재 확인 성공');
  };
  
  // 이메일 중복 여부 확인 (회원가입에서 사용)
  const validateEmailDuplicate = async (email) => {
    const user = await findUserByEmail(email);
    if (user) {
      return responseFormatter(false, ERROR_CODES.DUPLICATE_EMAIL_ERROR, '이미 사용 중인 이메일입니다.');
    }
    return responseFormatter(true, null, '이메일 중복 확인 성공');
  };

// 비밀번호 형식 검사
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,20}$/;

  // 정규식 검사
  if (!passwordRegex.test(password)) {
      return {
          success: false,
          errorCode: "INVALID_PASSWORD",
          message: "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자 (@, $, !, %, *, ?, &, #, ^)를 최소 1개 포함해야 합니다.",
      };
  }

  return {
      success: true,
      message: "비밀번호 검증 성공",
  };
};


  

// 필드 유효성 검사
const validateFields = (fields, data) => {
  for (const field of fields) {
    if (!data[field]) {
        throw new Error(`${field} 값이 누락되었습니다.`);
    }
  }

  return responseFormatter(true, null, '필드 검증 성공');
};

const validateNickname = async (nickname) => {

    if (nickname.length > 10) {
      return responseFormatter(false, ERROR_CODES.INVALID_NICKNAME_ERROR, '닉네임은 최대 10자까지 작성 가능합니다');
    }
  
    if (nickname.includes(' ')) {
      return responseFormatter(false, ERROR_CODES.INVALID_NICKNAME_ERROR, '닉네임에 띄어쓰기를 포함할 수 없습니다');
    }
  
    const isDuplicate = await checkNicknameExists(nickname);
    if (isDuplicate) {
      return responseFormatter(false, ERROR_CODES.DUPLICATE_NICKNAME_ERROR, '이미 사용 중인 닉네임입니다. 다른 닉네임을 설정해주세요');
    }
  
    return responseFormatter(true, null, '닉네임 검증 성공');
  };
  
  

const validateTitleLength = (title) => {
    if (title.length > 26) {
        throw new Error('제목은 26자를 넘길 수 없습니다.');
    }
};

const validateContentLength = (content) => {
    if (content.length > 100) {
        throw new Error('내용은 100자를 넘길 수 없습니다.');
    }
};

module.exports = {
  validateEmailFormat,
  validateEmailExists,
  validateEmailDuplicate,
  validatePassword,
  validateFields,
  validateNickname,
  validateTitleLength,
  validateContentLength
};
