const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-for-dev', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
