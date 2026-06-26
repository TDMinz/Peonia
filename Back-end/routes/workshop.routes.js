const express = require('express');
const workshopController = require('../controllers/workshop.controller');

const router = express.Router();

router.get('/', workshopController.getWorkshops);
router.get('/:id', workshopController.getWorkshopById);
router.get('/:id/bookings', workshopController.getWorkshopBookings);

module.exports = router;
