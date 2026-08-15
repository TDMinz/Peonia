const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      default: '',
    },

    short_description: {
      type: String,
      default: '',
      
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

    images: {
      type: [String],
      default: [],
    },

    age_range: {
      type: String,
      default: '',
    },

    difficulty: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },

    duration: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
    versionKey: false,
  }
);

module.exports = mongoose.model('Workshop', workshopSchema);