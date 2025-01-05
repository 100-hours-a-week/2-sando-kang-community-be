const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

module.exports = generateToken;
