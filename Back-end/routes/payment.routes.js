const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { authRequired, allowRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authRequired, allowRoles('super_admin', 'staff'), paymentController.getPaymentHistory);
router.post('/orders/:code', authRequired, allowRoles('super_admin', 'staff'), paymentController.payOrder);
router.post('/bookings/:code', authRequired, allowRoles('super_admin', 'staff'), paymentController.payBooking);

module.exports = router;
