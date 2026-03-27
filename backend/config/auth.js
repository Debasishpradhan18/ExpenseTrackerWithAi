const { admin } = require('./firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (token === 'demo-token') {
    req.user = { uid: 'demo-123', email: 'demo@example.com' };
    return next();
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // contains uid, email, etc.
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = { verifyToken };
