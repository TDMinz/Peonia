const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    booking_code: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    workshop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
      index: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    customer_phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    seats_booked: {
      type: Number,
      required: true,
      min: 1,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    deposit_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paid_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ['pending', 'partial_paid', 'paid', 'refunded'],
      default: 'pending',
      required: true,
    },
    bill_url: {
      type: String,
      default: '',
    },
    bill_status: {
      type: String,
      enum: ['none', 'uploaded', 'approved', 'rejected'],
      default: 'none',
      required: true,
    },
    bill_checked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    bill_checked_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
