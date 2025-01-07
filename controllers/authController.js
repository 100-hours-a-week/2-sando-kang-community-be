const asyncHandler = require('../util/asyncHandler');
const { handleImageProcessing, deleteImageFromS3 } = require('../util/s3ImageHandler');
const { validateFields, validateEmailExists, validateEmailFormat, validateEmailDuplicate, validatePassword, validateNickname } = require('../util/validation');
const ERROR_CODES = require('../exception/errors')
const authModel = require('../models/authModel');
const responseFormatter = require('../util/ResponseFormatter');
const base64 = require('base-64');
const generateToken = require('../security/jwt');


// NOTE: 로그인
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  let validationResult = validateFields(['email', 'password'], req.body);
  if (!validationResult.success) return res.status(400).json(validationResult);

  validationResult = validateEmailFormat(email);
  if (!validationResult.success) return res.status(400).json(validationResult);

  validationResult = await validateEmailExists(email);
  if (!validationResult.success) return res.status(404).json(validationResult);

  const encodedPassword = base64.encode(password);

  const user = await authModel.findUserByEmail(email);
  if (encodedPassword !== user.password) {
    return res.status(401).json(responseFormatter(false, ERROR_CODES.INVALID_PASSWORD, '비밀번호가 틀렸습니다'));
  }

  let profileUrl = null;
  if (user.profile) {
    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
    profileUrl = user.profile ? `${user.profile}` : null;
  }

  const token = generateToken(user);

  const responseData = {
    user_id: user.id,
    email: user.email,
    nickname: user.nickname,
    profile: profileUrl,
    token: token,
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.json(responseFormatter(true, 'login_success', responseData));
});

// NOTE: 로그아웃
exports.logout = asyncHandler(async (req, res, next) => {
   //TODO: redis 만기 토큰 관리
   //blacklist.add(token);
   //console.log(`Token added to blacklist: ${token}`);

   return res.json(responseFormatter(true, 'logout_success', null));
});

// NOTE: 회원가입
exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password, nickname } = req.body;

  let validationResult = validateFields(['email', 'password', 'nickname'], req.body);
  if (!validationResult.success) return res.status(400).json(validationResult);

  validationResult = validateEmailFormat(email);
  if (!validationResult.success) return res.status(400).json(validationResult);

  validationResult = await validateEmailDuplicate(email);
  if (!validationResult.success) return res.status(400).json(validationResult);

  validationResult = validatePassword(password);
  if (!validationResult.success) return res.status(400).json(validationResult);

  validationResult = await validateNickname(nickname);
  if (!validationResult.success) return res.status(400).json(validationResult);

  const encodedPassword = base64.encode(password);

  try {
    let profileUrl = null;

    if (req.file && req.file.buffer) {
      profileUrl = await handleImageProcessing(req.file.buffer, req.file.originalname);
    }

    console.log(`Profile URL: ${profileUrl || 'No file uploaded'}`);

    await authModel.createUser(email, encodedPassword, nickname, profileUrl);

    return res.json(responseFormatter(true, null, '회원 가입이 완료 되었습니다'));
  } catch (error) {
    console.error('Error during user creation:', error.message);
    if (!error.status) {
      return res
        .status(500)
        .json(responseFormatter(false, ERROR_CODES.CREATE_USER_ERROR, null));
    }
    return res.status(error.status).json(responseFormatter(false, error, null));
  }
});


// NOTE: 회원 탈퇴
exports.withdraw = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;

  validateFields(['user_id'], req.body);

  const user = await authModel.findUserById(user_id);
  if (!user) {
    return res.status(404).json(responseFormatter(false, ERROR_CODES.USER_NOT_FOUND, null));
  }

  const profileUrl = user.profile;
  if (profileUrl) {
    const profileKey = profileUrl.split('/').slice(-2).join('/');
    try {
      await deleteImageFromS3(profileKey);
      console.log(`Profile image deleted from S3: ${profileKey}`);
    } catch (error) {
      console.error(`Failed to delete profile image from S3: ${error.message}`);
    }
  }

  const deleteUser = await authModel.deleteUser(user_id);
  if (!deleteUser) {
    return res.json(responseFormatter(false, ERROR_CODES.DELETE_USER_ERROR, null));
  }

  return res.json(responseFormatter(true, 'withdraw_success'));
});

// NOTE: 회원정보 수정
exports.updateNickname = asyncHandler(async (req, res) => {
  const { user_id, nickname} = req.body;

  validateFields(['user_id', 'nickname'], req.body);

  const user = await authModel.findUserById(user_id); 
  
  let profileUrl = null; 
  if (req.file) {
    profileUrl = await handleImageProcessing(req.file.buffer, req.file.originalname);
  }else {
    profileUrl = user.profile;
  }

  try {
    await authModel.updateProfile(user.id, nickname, profileUrl);
   
    const responseData = {
      user_id: user_id,
      nickname: nickname,
      profile: profileUrl,
    };
    console.log(responseData);
    return res.json(responseFormatter(true, 'update_success', responseData));
  }
  catch(error){
    return res.json(responseFormatter(false, ERROR_CODES.UPDATE_NICKNAME_ERROR, null));
  }
  
});

// NOTE: 비밀번호 수정
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { user_id, password } = req.body;

  validateFields(['user_id', 'password'], req.body);

  const encodedPassword = base64.encode(password);
  const updatePassword = await authModel.updatePassword(user_id, encodedPassword);
  if(!updatePassword){
    return res.json(responseFormatter(false, ERROR_CODES.UPDATE_PASSWORD_ERROR, null));  
  }
  return res.json(responseFormatter(true, 'update_success', '비밀 번호 수정이 완료되었습니다'));
});