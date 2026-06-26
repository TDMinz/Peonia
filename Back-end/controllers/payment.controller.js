const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Booking = require('../models/booking.model');
const PaymentTransaction = require('../models/paymentTransaction.model');

function buildOrderPaymentResponse(order) {
  return {
    id: order._id,
    order_code: order.order_code,
    total_price: order.total_price,
    deposit_amount: order.deposit_amount,
    paid_amount: order.paid_amount,
    remaining_amount: Math.max(order.total_price - order.paid_amount, 0),
    payment_status: order.payment_status,
    status: order.status,
    created_at: order.created_at,
  };
}

function buildBookingPaymentResponse(booking) {
  return {
    id: booking._id,
    booking_code: booking.booking_code,
    total_price: booking.total_price,
    deposit_amount: booking.deposit_amount,
    paid_amount: booking.paid_amount,
    remaining_amount: Math.max(booking.total_price - booking.paid_amount, 0),
    payment_status: booking.payment_status,
    status: booking.status,
    created_at: booking.created_at,
  };
}

async function createPaymentTransaction({ targetType, targetId, targetCode, amount, paymentMethod, note, userId }) {
  return PaymentTransaction.create({
    target_type: targetType,
    target_id: targetId,
    target_code: targetCode,
    amount,
    payment_method: paymentMethod || 'cash',
    note: note || '',
    created_by: userId,
  });
}

async function payOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, payment_status, payment_method, note } = req.body;
    const order = await Order.findOne({ order_code: req.params.code });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });

    const payAmount = Number(amount ?? 0);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền thanh toán không hợp lệ.' });
    }

    const remainingBefore = Math.max(order.total_price - order.paid_amount, 0);
    const appliedAmount = Math.min(remainingBefore, payAmount);

    order.paid_amount += appliedAmount;
    order.remaining_amount = Math.max(order.total_price - order.paid_amount, 0);

    if (payment_status === 'paid' || order.remaining_amount === 0) {
      order.payment_status = 'paid';
      order.paid_amount = order.total_price;
      order.remaining_amount = 0;
    } else if (order.paid_amount >= order.deposit_amount) {
      order.payment_status = 'partial_paid';
    } else {
      order.payment_status = 'pending';
    }

    const savedOrder = await order.save({ session });
    const tx = await createPaymentTransaction({
      targetType: 'order',
      targetId: savedOrder._id,
      targetCode: savedOrder.order_code,
      amount: appliedAmount,
      paymentMethod: payment_method,
      note,
      userId: req.user._id,
    });

    await session.commitTransaction();
    return res.json({
      message: 'Thanh toán đơn hàng thành công.',
      order: buildOrderPaymentResponse(savedOrder),
      payment_transaction: tx,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Lỗi thanh toán đơn hàng.', error: error.message });
  } finally {
    session.endSession();
  }
}

async function payBooking(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, payment_status, payment_method, note } = req.body;
    const booking = await Booking.findOne({ booking_code: req.params.code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });

    const payAmount = Number(amount ?? 0);
    if (!Number.isFinite(payAmount) || payAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền thanh toán không hợp lệ.' });
    }

    const remainingBefore = Math.max(booking.total_price - booking.paid_amount, 0);
    const appliedAmount = Math.min(remainingBefore, payAmount);

    booking.paid_amount += appliedAmount;
    if (payment_status === 'paid' || booking.paid_amount >= booking.total_price) {
      booking.payment_status = 'paid';
      booking.paid_amount = booking.total_price;
    } else if (booking.paid_amount >= booking.deposit_amount) {
      booking.payment_status = 'partial_paid';
    } else {
      booking.payment_status = 'pending';
    }

    const savedBooking = await booking.save({ session });
    const tx = await createPaymentTransaction({
      targetType: 'booking',
      targetId: savedBooking._id,
      targetCode: savedBooking.booking_code,
      amount: appliedAmount,
      paymentMethod: payment_method,
      note,
      userId: req.user._id,
    });

    await session.commitTransaction();
    return res.json({
      message: 'Thanh toán booking thành công.',
      booking: buildBookingPaymentResponse(savedBooking),
      payment_transaction: tx,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ message: 'Lỗi thanh toán booking.', error: error.message });
  } finally {
    session.endSession();
  }
}

async function getPaymentHistory(req, res) {
  try {
    const { target_type, target_code } = req.query;
    const query = {};
    if (target_type) query.target_type = target_type;
    if (target_code) query.target_code = target_code;

    const payments = await PaymentTransaction.find(query).sort({ created_at: -1 }).populate('created_by', 'username full_name role');
    return res.json({ payments });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy lịch sử thanh toán.', error: error.message });
  }
}

module.exports = {
  payOrder,
  payBooking,
  getPaymentHistory,
};
