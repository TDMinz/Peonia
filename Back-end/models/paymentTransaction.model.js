const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema(
  {
    target_type: {
      type: String,
      required: true,
      enum: ['order', 'booking'],
      index: true,
    },
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    target_code: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_method: {
      type: String,
      default: 'cash',
      trim: true,
    },
    note: {
      type: String,
      default: '',
    },
    paid_at: {
      type: Date,
      default: Date.now,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
