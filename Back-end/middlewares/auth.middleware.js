const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET =
  process.env.JWT_SECRET || 'peonia_secret_key';

  async function authRequired(req, res, next) {
    console.log('==========');
  console.log(req.method, req.originalUrl);
  console.log('Authorization:', req.headers.authorization);
  
    try {
      const authHeader = req.headers.authorization;
  
      const token =
        authHeader &&
        authHeader.startsWith('Bearer ')
          ? authHeader.split(' ')[1]
          : null;
  
      console.log('Token:', token);
  
      if (!token) {
        return res.status(401).json({
          message: 'Thiếu token xác thực.',
        });
      }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(
      decoded.userId
    ).select('-password_hash');

    if (!user) {
      return res.status(401).json({
        message: 'Người dùng không tồn tại.',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message:
        'Token không hợp lệ hoặc đã hết hạn.',
    });
  }
}

/**
 * Middleware mới
 * Có token thì lấy user
 * Không có token vẫn cho đi tiếp
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader &&
      authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    // Guest
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(
      decoded.userId
    ).select('-password_hash');

    req.user = user || null;

    next();
  } catch (err) {
    // Token lỗi cũng coi như guest
    req.user = null;
    next();
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Chưa xác thực.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Không có quyền truy cập.',
      });
    }

    next();
  };
}

module.exports = {
  authRequired,
  optionalAuth,
  allowRoles,
};