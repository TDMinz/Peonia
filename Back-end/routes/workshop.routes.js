const express = require('express');

const {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopBookings,
} = require('../controllers/workshop.controller');

const router = express.Router();

console.log('===== WORKSHOP ROUTER LOADED =====');
console.log('WORKSHOP ROUTES PATH:', __filename);

// GET danh sách workshop
router.get('/', getWorkshops);

// GET chi tiết workshop
router.get('/:id', getWorkshopById);

// POST tạo workshop
router.post('/', createWorkshop);

// PUT cập nhật workshop
router.put('/:id', updateWorkshop);

// DELETE workshop
router.delete('/:id', deleteWorkshop);

// GET booking của workshop
router.get('/:id/bookings', getWorkshopBookings);

module.exports = router;