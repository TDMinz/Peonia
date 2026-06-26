const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authRequired, allowRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authRequired, allowRoles('super_admin', 'staff'));
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
