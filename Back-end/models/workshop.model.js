const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      default: '',
    },
    event_date: {
      type: Date,
      required: true,
    },
    max_slots: {
      type: Number,
      required: true,
      min: 1,
    },
    available_slots: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image_url: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model('Workshop', workshopSchema);

