const express = require('express');
const authController = require('../controllers/auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/forgot-password/verify', authController.verifyResetCode);
router.post('/forgot-password/reset', authController.resetPassword);
router.get('/me', authRequired, authController.me);
router.patch('/change-password', authRequired, authController.changePassword);

module.exports = router;
