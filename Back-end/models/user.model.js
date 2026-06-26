const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true,
    },
    password_hash: {
      type: String,
      required: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    role: {
      type: String,
      required: true,
      enum: ['super_admin', 'staff', 'customer'],
      default: 'customer',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    reset_password_code: {
      type: String,
      default: null,
    },
    reset_password_expires_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model('User', userSchema);
