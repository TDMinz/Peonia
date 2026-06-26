async function getProvinces(req, res) {
  try {
    const response = await fetch('https://provinces.open-api.vn/api/p/?depth=3');
    if (!response.ok) {
      return res.status(502).json({ message: 'Không tải được dữ liệu địa chỉ.' });
    }

    const data = await response.json();
    return res.json({ provinces: data });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy dữ liệu địa chỉ.', error: error.message });
  }
}

module.exports = {
  getProvinces,
};
