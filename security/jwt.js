const jwt = require('jsonwebtoken');
//require('dotenv').config({ path: '.env.local' }); 

const generateToken = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

module.exports = generateToken;
