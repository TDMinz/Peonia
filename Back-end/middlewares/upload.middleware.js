const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    // Tăng giới hạn từ 5MB lên 10MB
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    // Chỉ cho phép upload ảnh
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ được phép upload file ảnh."));
    }

    cb(null, true);
  },
});

module.exports = upload;