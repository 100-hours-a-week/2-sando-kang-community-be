const responseFormatter = require('../util/ResponseFormatter');
const ERROR_CODES = require('../exception/errors');
const jwt = require('jsonwebtoken');

//require('dotenv').config({ path: '.env.local' }); 

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (token) {
    const cleanToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token;

    jwt.verify(cleanToken, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.error('JWT Verification Error:', err.message);
        return res.json(responseFormatter(false, ERROR_CODES.EXPIRED_JWT_TOKEN, null));
      }
      req.user = user; 
      next();
    });
  } else {
    console.error('No Authorization Header Found');
    res.json(responseFormatter(false, ERROR_CODES.INVALID_JWT_TOKEN, null));
  }
};

module.exports = authenticateJWT;
