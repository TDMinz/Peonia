const Workshop = require('../models/workshop.model');
const Booking = require('../models/booking.model');

function toWorkshopResponse(workshop) {
  return {
    id: workshop._id,
    title: workshop.title,
    description: workshop.description,
    event_date: workshop.event_date,
    max_slots: workshop.max_slots,
    available_slots: workshop.available_slots,
    remaining_slots: workshop.available_slots,
    booked_slots: workshop.max_slots - workshop.available_slots,
    price: workshop.price,
    image_url: workshop.image_url,
    created_at: workshop.created_at,
  };
}

function toBookingResponse(booking) {
  return {
    id: booking._id,
    booking_code: booking.booking_code,
    workshop: booking.workshop_id,
    customer_name: booking.customer_name,
    customer_phone: booking.customer_phone,
    seats_booked: booking.seats_booked,
    total_price: booking.total_price,
    deposit_amount: booking.deposit_amount,
    paid_amount: booking.paid_amount,
    remaining_amount: Math.max(booking.total_price - booking.paid_amount, 0),
    payment_status: booking.payment_status,
    status: booking.status,
    created_at: booking.created_at,
  };
}

async function getWorkshops(req, res) {
  try {
    const workshops = await Workshop.find().sort({ event_date: 1 });
    return res.json({ workshops: workshops.map(toWorkshopResponse) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy workshop.', error: error.message });
  }
}

async function getWorkshopById(req, res) {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Không tìm thấy workshop.' });
    return res.json({ workshop: toWorkshopResponse(workshop) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy workshop.', error: error.message });
  }
}

async function getWorkshopBookings(req, res) {
  try {
    const { status, payment_status } = req.query;
    const query = { workshop_id: req.params.id };
    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;

    const bookings = await Booking.find(query).sort({ created_at: -1 });
    return res.json({ bookings: bookings.map(toBookingResponse) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy booking workshop.', error: error.message });
  }
}

module.exports = {
  getWorkshops,
  getWorkshopById,
  getWorkshopBookings,
};