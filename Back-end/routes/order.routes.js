const express = require('express');
const orderController = require('../controllers/order.controller');
const { authRequired, allowRoles } = require('../middlewares/auth.middleware');
const {
    optionalAuth,
  } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', optionalAuth, orderController.createOrder);
router.get('/', authRequired, allowRoles('super_admin', 'staff','customer'), orderController.getOrders);
router.get('/:code', authRequired, allowRoles('super_admin', 'staff'), orderController.getOrderByCode);
router.patch('/:code/status', authRequired, allowRoles('super_admin', 'staff'), orderController.updateOrderStatus);
router.delete('/:code', authRequired, allowRoles('super_admin', 'staff'), orderController.deleteOrder);
module.exports = router;
