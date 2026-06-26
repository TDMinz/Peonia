const mongoose = require('mongoose');
const Booking = require('../models/booking.model');
const Workshop = require('../models/workshop.model');
const cloudinary = require('../utils/cloudinary');
const { getNextSequence, formatCode } = require('../services/sequence.service');
const {
  sendWorkshopBookingNotification,
} = require('../utils/mailer');
const DEPOSIT_RATE = Number(process.env.WORKSHOP_DEPOSIT_RATE || 0.3);

function uploadBufferToCloudinary(buffer, folder = 'peonia/bookings') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

function calcDeposit(totalPrice) {
  return Math.round(totalPrice * DEPOSIT_RATE);
}

function bookingToResponse(booking) {
  return {
    id: booking._id,
    booking_code: booking.booking_code,
    user: booking.user_id,
    workshop: booking.workshop_id,
    customer_name: booking.customer_name,
    customer_phone: booking.customer_phone,
    seats_booked: booking.seats_booked,
    total_price: booking.total_price,
    deposit_amount: booking.deposit_amount,
    paid_amount: booking.paid_amount,
    remaining_amount: Math.max(booking.total_price - booking.paid_amount, 0),
    payment_status: booking.payment_status,
    bill_url: booking.bill_url,
    bill_status: booking.bill_status,
    bill_checked_by: booking.bill_checked_by,
    bill_checked_at: booking.bill_checked_at,
    status: booking.status,
    created_at: booking.created_at,
  };
}

async function getPopulatedBooking(query) {
  return Booking.findOne(query)
    .populate('workshop_id')
    .populate('user_id', 'username full_name role');
}

async function getMyBookings(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const skip = (page - 1) * limit;

    const total = await Booking.countDocuments({
      user_id: new mongoose.Types.ObjectId(req.user._id),
    });

    const bookings = await Booking.find({
      user_id: new mongoose.Types.ObjectId(req.user._id),
    })
      .populate('workshop_id')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      bookings: bookings.map(bookingToResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi lấy lịch sử workshop.',
      error: error.message,
    });
  }
}

async function createBooking(req, res) { 
  console.log('Đã vào createBooking');
  try {
    const userId = req.user._id;
  
    const {
      workshop_id,
      customer_name,
      customer_phone,
      seats_booked
    } = req.body;
    console.log('1. Tìm workshop');
    const workshop =
      await Workshop.findById(workshop_id);
      console.log('2. Workshop OK');
    if (!workshop) {
      return res.status(404).json({
        message: 'Không tìm thấy workshop.'
      });
    }
  
    if (
      workshop.available_slots <
      seats_booked
    ) {
      return res.status(400).json({
        message:
          'Không đủ chỗ trống.'
      });
    }
  
    const total_price =
      workshop.price * seats_booked;
  
    const deposit_amount =
      calcDeposit(total_price);
  
    const seq =
      await getNextSequence(
        'booking_code'
      );
  
    const booking_code =
      formatCode('WS', seq);
      console.log('3. Tạo booking');
    const booking =
      await Booking.create({
        user_id: userId,
        booking_code,
        workshop_id,
        customer_name,
        customer_phone,
        seats_booked,
        total_price,
        deposit_amount,
        paid_amount:
          deposit_amount,
        payment_status:
          'partial_paid',
        status: 'pending',
      });
      console.log('4. Booking OK');
    await Workshop.updateOne(
      { _id: workshop_id },
      {
        $inc: {
          available_slots:
            -seats_booked,
        },
      }
    );
    console.log('5. Update workshop OK');
    sendWorkshopBookingNotification(booking, workshop)
  .catch((err) => {
    console.error(
      'Lỗi gửi email:',
      err.message
    );
  });
  console.log('Booking tạo thành công');
    return res.status(201).json({
      message:
        'Tạo booking thành công.',
      booking,
    });
  } catch (error) {
    
    console.error(error);
  
    return res.status(500).json({
      message: 'Lỗi tạo booking.',
      error: error.message,
    });
  }
}


async function getBookings(req, res) { /* unchanged */
  try {
    const { status, payment_status, workshop_id } = req.query;
    const query = {};
    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;
    if (workshop_id) query.workshop_id = workshop_id;

    const bookings = await Booking.find(query).sort({ created_at: -1 }).populate('workshop_id').populate('user_id', 'username full_name role');
    return res.json({ bookings: bookings.map(bookingToResponse) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách booking.', error: error.message });
  }
}

async function getBookingByCode(req, res) { /* unchanged */
  try {
    const booking = await Booking.findOne({ booking_code: req.params.code }).populate('workshop_id').populate('user_id', 'username full_name role');
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });
    return res.json({ booking: bookingToResponse(booking) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy booking.', error: error.message });
  }
}

async function updateBookingStatus(req, res) {
  try {
    const { status, payment_status } = req.body;
    if (!status && !payment_status) return res.status(400).json({ message: 'Thiếu status hoặc payment_status.' });

    const booking = await Booking.findOne({ booking_code: req.params.code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });

    const prevStatus = booking.status;

    if (status) booking.status = status;
    if (payment_status) booking.payment_status = payment_status;

    if (status === 'cancelled' && prevStatus !== 'cancelled') {
      await Workshop.updateOne({ _id: booking.workshop_id }, { $inc: { available_slots: booking.seats_booked } });
      booking.payment_status = 'refunded';
      booking.paid_amount = 0;
    }

    if (payment_status === 'paid') {
      booking.paid_amount = booking.total_price;
      booking.payment_status = 'paid';
    }

    if (payment_status === 'partial_paid' && booking.paid_amount < booking.deposit_amount) {
      booking.paid_amount = booking.deposit_amount;
      booking.payment_status = 'partial_paid';
    }

    await booking.save();

    const populated = await getPopulatedBooking({ booking_code: req.params.code });
    return res.json({ message: 'Cập nhật booking thành công.', booking: bookingToResponse(populated) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật booking.', error: error.message });
  }
}


async function uploadBookingBill(req, res) { /* unchanged */
  try {
    const { code } = req.params;
    if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn ảnh bill.' });

    const booking = await Booking.findOne({ booking_code: code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });

    const uploaded = await uploadBufferToCloudinary(req.file.buffer, 'peonia/bills');
    booking.bill_url = uploaded.secure_url;
    booking.bill_status = 'uploaded';
    booking.payment_status = 'partial_paid';
    booking.paid_amount = booking.deposit_amount;
    await booking.save();

    return res.json({ message: 'Đã tải bill lên thành công.', booking: bookingToResponse(booking) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tải bill lên.', error: error.message });
  }
}

async function reviewBookingBill(req, res) { /* unchanged */
  try {
    const { code } = req.params;
    const { action } = req.body;
    const booking = await Booking.findOne({ booking_code: code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });

    if (action === 'approve') {
      booking.bill_status = 'approved';
      booking.status = 'confirmed';
      booking.bill_checked_by = req.user._id;
      booking.bill_checked_at = new Date();
    } else if (action === 'reject') {
      booking.bill_status = 'rejected';
      booking.bill_checked_by = req.user._id;
      booking.bill_checked_at = new Date();
    } else {
      return res.status(400).json({ message: 'Hành động không hợp lệ.' });
    }

    await booking.save();
    return res.json({ message: 'Cập nhật bill thành công.', booking: bookingToResponse(booking) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi duyệt bill.', error: error.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findOne({ booking_code: req.params.code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });

    if (booking.status !== 'cancelled') {
      await Workshop.updateOne({ _id: booking.workshop_id }, { $inc: { available_slots: booking.seats_booked } });
    }

    await Booking.deleteOne({ _id: booking._id });
    return res.json({ message: 'Xóa booking thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa booking.', error: error.message });
  }
}


module.exports = {
  createBooking,
  getBookings,
  getBookingByCode,
  updateBookingStatus,
  uploadBookingBill,
  reviewBookingBill,
  deleteBooking,
  getMyBookings,
};