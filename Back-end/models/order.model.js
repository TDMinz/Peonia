const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    order_code: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    buyer_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    buyer_phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    recipient_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    recipient_phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    recipient_address: {
      type: String,
      required: true,
      trim: true,
    },
    delivery_date: {
      type: Date,
      required: true,
    },
    delivery_time_slot: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    card_message: {
      type: String,
      default: '',
    },
    subtotal_price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    deposit_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    paid_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    remaining_amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total_price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ['pending', 'partial_paid', 'paid', 'refunded'],
      default: 'pending',
      required: true,
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

module.exports = mongoose.model('Order', orderSchema);
