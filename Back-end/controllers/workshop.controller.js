const Workshop = require('../models/workshop.model');
const Booking = require('../models/booking.model');

function toWorkshopResponse(workshop) {
  return {
    id: workshop._id,
    title: workshop.title,

    price: workshop.price,

    age_range: workshop.age_range || '',
    difficulty: workshop.difficulty || 1,
    duration: workshop.duration || '',

    short_description: workshop.short_description || '',
    description: workshop.description || '',

    image_url: workshop.image_url || '',
    images: workshop.images || [],

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
    remaining_amount: Math.max(
      booking.total_price - booking.paid_amount,
      0
    ),
    payment_status: booking.payment_status,
    status: booking.status,
    created_at: booking.created_at,
  };
}

/* =========================================================
   GET - DANH SÁCH WORKSHOP
========================================================= */

async function getWorkshops(req, res) {
  try {
    console.log('===== GET WORKSHOPS CONTROLLER =====');

    const workshops = await Workshop.find()
      .sort({ created_at: -1 })
      .lean();

    console.log('WORKSHOP COUNT:', workshops.length);

    return res.status(200).json({
      success: true,
      source: 'workshop.controller.js',
      workshops: workshops.map(toWorkshopResponse),
    });

  } catch (error) {
    console.error('GET WORKSHOPS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy workshop.',
      error: error.message,
    });
  }
}

/* =========================================================
   GET - CHI TIẾT WORKSHOP
========================================================= */

async function getWorkshopById(req, res) {
  try {
    const workshop = await Workshop.findById(req.params.id).lean();

    if (!workshop) {
      return res.status(404).json({
        message: 'Không tìm thấy workshop.',
      });
    }

    return res.json({
      workshop: toWorkshopResponse(workshop),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi lấy workshop.',
      error: error.message,
    });
  }
}

/* =========================================================
   POST - TẠO WORKSHOP
========================================================= */

async function createWorkshop(req, res) {
  try {
    const {
      title,
      description = '',
      short_description = '',
      price,
      age_range = '',
      difficulty = 1,
      duration = '',
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Vui lòng nhập tên workshop.',
      });
    }

    if (
      price === undefined ||
      Number.isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        message: 'Giá workshop không hợp lệ.',
      });
    }

    const normalizedDifficulty = Math.min(
      5,
      Math.max(
        1,
        Number(difficulty) || 1
      )
    );

    // =====================================
    // UPLOAD 4 ẢNH SONG SONG
    // =====================================

    const uploadTasks = [];

    for (let i = 0; i < 4; i++) {
      const file =
        req.files?.[`image_${i}`]?.[0];

      if (file) {
        uploadTasks.push(
          uploadImageFromBuffer(
            file,
            'peonia/workshops'
          ).then((url) => ({
            index: i,
            url,
          }))
        );
      }
    }

    const uploadedResults =
      await Promise.all(uploadTasks);

    const images = [];

    uploadedResults.forEach(
      ({ index, url }) => {
        images[index] = url;
      }
    );

    // =====================================
    // TẠO WORKSHOP
    // =====================================

    const image_url =
      images[0] || '';

    const workshop =
      await Workshop.create({
        title: title.trim(),

        description,

        short_description:
          String(short_description || ''),

        price: Number(price),

        image_url,

        images,

        age_range,

        difficulty:
          normalizedDifficulty,

        duration,
      });

    return res.status(201).json({
      message:
        'Tạo workshop thành công.',

      workshop:
        toWorkshopResponse(workshop),
    });

  } catch (error) {
    console.error(
      'createWorkshop error:',
      error
    );

    return res.status(500).json({
      message:
        'Lỗi tạo workshop.',

      error: error.message,
    });
  }
}

/* =========================================================
   PUT - CẬP NHẬT WORKSHOP
========================================================= */

async function updateWorkshop(req, res) {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        message: 'Không tìm thấy workshop.',
      });
    }

    const {
      title,
      description,
      short_description,
      price,
      age_range,
      difficulty,
      duration,
    } = req.body;

    if (title !== undefined) {
      workshop.title = title.trim();
    }

    if (description !== undefined) {
      workshop.description = description;
    }

    if (short_description !== undefined) {
      workshop.short_description = String(short_description);
    }

    if (price !== undefined) {
      workshop.price = Number(price);
    }

    if (age_range !== undefined) {
      workshop.age_range = age_range;
    }

    if (difficulty !== undefined) {
      workshop.difficulty = Math.min(
        5,
        Math.max(1, Number(difficulty) || 1)
      );
    }

    if (duration !== undefined) {
      workshop.duration = duration;
    }

    // =========================
    // XỬ LÝ ẢNH
    // =========================

    let images = workshop.images || [];

    if (req.body.images !== undefined) {
      try {
        images =
          typeof req.body.images === 'string'
            ? JSON.parse(req.body.images)
            : req.body.images;
      } catch {
        images = workshop.images || [];
      }
    }

    if (!Array.isArray(images)) {
      images = [];
    }

    if (Array.isArray(req.files) && req.files.length > 0) {
      const uploadedImages = req.files
        .map(
          (file) =>
            file.path ||
            file.secure_url ||
            file.url
        )
        .filter(Boolean);

      images = [
        ...images,
        ...uploadedImages,
      ];
    }

    images = images
      .filter(Boolean)
      .slice(0, 4);

    workshop.images = images;

    workshop.image_url =
      images[0] ||
      req.body.image_url ||
      workshop.image_url ||
      '';

    await workshop.save();

    return res.json({
      message: 'Cập nhật workshop thành công.',
      workshop: toWorkshopResponse(workshop),
    });
  } catch (error) {
    console.error('updateWorkshop error:', error);

    return res.status(500).json({
      message: 'Lỗi cập nhật workshop.',
      error: error.message,
    });
  }
}

/* =========================================================
   DELETE - XÓA WORKSHOP
========================================================= */

async function deleteWorkshop(req, res) {
  try {
    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({
        message: 'Không tìm thấy workshop.',
      });
    }

    /*
      Kiểm tra workshop đã có booking chưa.
      Nếu đã có booking thì không nên xóa để tránh
      mất dữ liệu lịch sử.
    */
    const bookingCount = await Booking.countDocuments({
      workshop_id: workshop._id,
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        message:
          'Workshop đã có booking nên không thể xoá.',
      });
    }

    await Workshop.deleteOne({
      _id: workshop._id,
    });

    return res.json({
      message: 'Xóa workshop thành công.',
    });
  } catch (error) {
    console.error('deleteWorkshop error:', error);

    return res.status(500).json({
      message: 'Lỗi xoá workshop.',
      error: error.message,
    });
  }
}

/* =========================================================
   GET - BOOKING CỦA WORKSHOP
========================================================= */

async function getWorkshopBookings(req, res) {
  try {
    const {
      status,
      payment_status,
    } = req.query;

    const query = {
      workshop_id: req.params.id,
    };

    if (status) {
      query.status = status;
    }

    if (payment_status) {
      query.payment_status = payment_status;
    }

    const bookings = await Booking.find(query)
      .sort({ created_at: -1 });

    return res.json({
      bookings: bookings.map(toBookingResponse),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi lấy booking workshop.',
      error: error.message,
    });
  }
}

module.exports = {
  getWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopBookings,
};