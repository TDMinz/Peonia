const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user.model');
const { sendResetCodeEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'peonia_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

function sanitizeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
  };
}

function signAuthToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register(req, res) {
  try {
    const { username, password, full_name, email } = req.body;
    if (!username || !password || !full_name) return res.status(400).json({ message: 'Thiếu username, password hoặc full_name.' });

    const existedUser = await User.findOne({ username });
    if (existedUser) return res.status(409).json({ message: 'Username đã tồn tại.' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email: email || '', password_hash, full_name, role: 'customer', is_active: true });
    return res.status(201).json({ message: 'Đăng ký thành công.', token: signAuthToken(user), user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server khi đăng ký.', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Thiếu username hoặc password.' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu.' });
    if (!user.is_active) return res.status(403).json({ message: 'Tài khoản đã bị khóa.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu.' });

    return res.json({ message: 'Đăng nhập thành công.', token: signAuthToken(user), user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server khi đăng nhập.', error: error.message });
  }
}

async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Thiếu credential Google.' });
    if (!googleClient) return res.status(500).json({ message: 'Chưa cấu hình GOOGLE_CLIENT_ID.' });

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = String(payload?.email || '').toLowerCase();
    const full_name = payload?.name || email.split('@')[0] || 'Google User';

    if (!email) return res.status(400).json({ message: 'Không lấy được email từ Google.' });

    let user = await User.findOne({ email });
    if (!user) {
      const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30) || `google_${Date.now()}`;
      let username = baseUsername;
      let suffix = 0;
      while (await User.findOne({ username })) {
        suffix += 1;
        username = `${baseUsername}${suffix}`;
      }
      user = await User.create({ username, email, password_hash: await bcrypt.hash(String(credential).slice(0, 20), 10), full_name, role: 'customer', is_active: true });
    } else if (!user.email) {
      user.email = email;
      await user.save();
    }

    return res.json({ message: 'Đăng nhập Google thành công.', token: signAuthToken(user), user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi đăng nhập Google.', error: error.message });
  }
}

async function me(req, res) { return res.json({ user: req.user }); }
async function changePassword(req, res) {
  try {
    const userId = req.user?._id;
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ message: 'Thiếu current_password hoặc new_password.' });
    if (String(new_password).length < 6) return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng.' });
    user.password_hash = await bcrypt.hash(new_password, 10);
    await user.save();
    return res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (error) { return res.status(500).json({ message: 'Lỗi đổi mật khẩu.', error: error.message }); }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Vui lòng nhập email.' });
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này.' });
    const code = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6).padEnd(6, 'X');
    user.reset_password_code = code;
    user.reset_password_expires_at = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    await sendResetCodeEmail(user.email, code, user.full_name);
    return res.json({ message: 'Đã gửi mã khôi phục mật khẩu đến email của bạn.' });
  } catch (error) { return res.status(500).json({ message: 'Lỗi quên mật khẩu.', error: error.message }); }
}

async function verifyResetCode(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Thiếu email hoặc mã xác minh.' });
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !user.reset_password_code) return res.status(400).json({ message: 'Mã xác minh không hợp lệ.' });
    if (!user.reset_password_expires_at || user.reset_password_expires_at < new Date()) return res.status(400).json({ message: 'Mã xác minh đã hết hạn.' });
    if (String(user.reset_password_code).trim().toUpperCase() !== String(code).trim().toUpperCase()) return res.status(400).json({ message: 'Mã xác minh không đúng.' });
    return res.json({ message: 'Xác minh mã thành công.' });
  } catch (error) { return res.status(500).json({ message: 'Lỗi xác minh mã.', error: error.message }); }
}

async function resetPassword(req, res) {
  try {
    const { email, code, new_password } = req.body;
    if (!email || !code || !new_password) return res.status(400).json({ message: 'Thiếu email, mã xác minh hoặc mật khẩu mới.' });
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !user.reset_password_code) return res.status(400).json({ message: 'Mã xác minh không hợp lệ.' });
    if (!user.reset_password_expires_at || user.reset_password_expires_at < new Date()) return res.status(400).json({ message: 'Mã xác minh đã hết hạn.' });
    if (String(user.reset_password_code).trim().toUpperCase() !== String(code).trim().toUpperCase()) return res.status(400).json({ message: 'Mã xác minh không đúng.' });
    if (String(new_password).length < 6) return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    user.password_hash = await bcrypt.hash(new_password, 10);
    user.reset_password_code = null;
    user.reset_password_expires_at = null;
    await user.save();
    return res.json({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (error) { return res.status(500).json({ message: 'Lỗi đặt lại mật khẩu.', error: error.message }); }
}

module.exports = { register, login, googleLogin, me, changePassword, forgotPassword, verifyResetCode, resetPassword };
