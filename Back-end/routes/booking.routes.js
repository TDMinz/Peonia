const express = require('express');
const bookingController = require('../controllers/booking.controller');
const upload = require('../middlewares/upload.middleware');
const { authRequired, allowRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authRequired, allowRoles('customer','super_admin', 'staff'), bookingController.createBooking);
router.get(
    '/my-bookings',
    authRequired,
    allowRoles('customer'),
    bookingController.getMyBookings
  );
module.exports = router;
router.get('/', authRequired, allowRoles('super_admin', 'staff'), bookingController.getBookings);
router.get('/:code', authRequired, allowRoles('super_admin', 'staff'), bookingController.getBookingByCode);
router.patch('/:code/status', authRequired, allowRoles('super_admin', 'staff'), bookingController.updateBookingStatus);
router.post('/:code/bill', authRequired, upload.single('bill'), bookingController.uploadBookingBill);
router.patch('/:code/bill/review', authRequired, allowRoles('super_admin', 'staff'), bookingController.reviewBookingBill);
router.delete('/:code', authRequired, allowRoles('super_admin', 'staff'), bookingController.deleteBooking);

