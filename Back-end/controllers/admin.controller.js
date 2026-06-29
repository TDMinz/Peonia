const cloudinary = require('../utils/cloudinary');
const { Readable } = require('stream');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const ProductVariant = require('../models/productVariant.model');
const ProductCategory = require('../models/productCategory.model');
const Workshop = require('../models/workshop.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');

function toCategoryResponse(category) {
  return {
    id: category._id,
    name: category.name,
    slug: category.slug,
    type: category.type,
    description: category.description,
    parentId: category.parentId,
    image_url: category.image_url,
    icon: category.icon,
    order: category.order,
    is_active: category.is_active,
    created_at: category.created_at,
  };
}

function toProductResponse(product) {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    sale_price: product.sale_price,

    category_ids: product.categoryId
      ? [String(product.categoryId)]
      : [],

    images: product.images || [],
    image_url: product.image_url || '',
    is_active: product.is_active,
    is_addon: product.is_addon,
    is_featured: product.is_featured,
    is_best_seller: product.is_best_seller,
  };
}
function toVariantResponse(variant) {
  return {
    id: variant._id,
    product_id: variant.product_id,
    variant_name: variant.variant_name,
    price: variant.price,
    sku: variant.sku,
    created_at: variant.created_at,
  };
}
function slugify(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function toWorkshopResponse(workshop) {
  return {
    id: workshop._id,
    title: workshop.title,
    description: workshop.description,
    event_date: workshop.event_date,
    max_slots: workshop.max_slots,
    available_slots: workshop.available_slots,
    price: workshop.price,
    image_url: workshop.image_url,
    created_at: workshop.created_at,
  };
}

function toUserResponse(user) {
  return {
    id: user._id,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
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
    remaining_amount: Math.max(booking.total_price - booking.paid_amount, 0),
    payment_status: booking.payment_status,
    bill_url: booking.bill_url,
    bill_status: booking.bill_status,
    status: booking.status,
    created_at: booking.created_at,
  };
}

function toOrderResponse(order, items = []) {
  return {
    id: order._id,
    order_code: order.order_code,
    buyer_name: order.buyer_name,
    recipient_name: order.recipient_name,
    recipient_address: order.recipient_address,
    total_price: order.total_price,
    status: order.status,
    payment_status: order.payment_status,
    created_at: order.created_at,

    items: items.map((item) => ({
      id: item._id,
      quantity: item.quantity,
      price: item.price,

      product_id: item.product_id?._id,
      product_name: item.product_id?.name || '',

      image_url:
        item.product_id?.image_url ||
        item.product_id?.images?.[0] ||
        '',
    })),
  };
}

function paginate(query, page, limit) {
  return query.skip((page - 1) * limit).limit(limit);
}

function validateSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function parseCategoryIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

async function uploadImageFromBuffer(file, folder) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
      if (error) return reject(error);
      return resolve(result.secure_url);
    });
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}

async function createCategory(req, res) {
  try {
    const { name, slug, type, description = '', parentId = null, image_url = '', icon = '', order = 0, is_active = true } = req.body;
    if (!name || !slug || !type) return res.status(400).json({ message: 'Thiếu name, slug hoặc type.' });
    if (!validateSlug(slug)) return res.status(400).json({ message: 'Slug danh mục không hợp lệ.' });
    const existed = await Category.findOne({ slug });
    if (existed) return res.status(409).json({ message: 'Slug danh mục đã tồn tại.' });
    const category = await Category.create({ name, slug, type, description, parentId, image_url, icon, order, is_active });
    return res.status(201).json({ message: 'Tạo danh mục thành công.', category: toCategoryResponse(category) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi tạo danh mục.', error: error.message });
  }
}

async function getCategoriesAdmin(req, res) {
  try {
    const { type, search = '', page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 20, 1);
    const [items, total] = await Promise.all([paginate(Category.find(query).sort({ created_at: -1 }), pageNum, limitNum), Category.countDocuments(query)]);
    return res.json({ data: items.map(toCategoryResponse), pagination: { page: pageNum, limit: limitNum, total, total_pages: Math.ceil(total / limitNum) } });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh mục.', error: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    if (req.body.slug && !validateSlug(req.body.slug)) return res.status(400).json({ message: 'Slug danh mục không hợp lệ.' });
    
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
    return res.json({ message: 'Cập nhật danh mục thành công.', category: toCategoryResponse(category) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật danh mục.', error: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
    await ProductCategory.deleteMany({ category_id: category._id });
    return res.json({ message: 'Xóa danh mục thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa danh mục.', error: error.message });
  }
}

async function createProduct(req, res) {
  try {
    const {
      name,
      slug,
      description,
      is_addon,
      is_featured,
      is_best_seller,
      price,
      sale_price,
      categoryId,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: 'Thiếu name hoặc slug.',
      });
    }

    // Chuẩn hóa slug tiếng Việt -> slug URL
    const normalizedSlug = slugify(slug);

    if (!validateSlug(normalizedSlug)) {
      return res.status(400).json({
        message: 'Slug sản phẩm không hợp lệ.',
      });
    }

    const existed = await Product.findOne({
      slug: normalizedSlug,
    });

    if (existed) {
      return res.status(409).json({
        message: 'Slug sản phẩm đã tồn tại.',
      });
    }

    const images = [];

    // Upload tối đa 4 ảnh
    for (let i = 0; i < 4; i++) {
      const file =
        req.files?.[`image_${i}`]?.[0];

      if (file) {
        const uploadedUrl =
          await uploadImageFromBuffer(
            file,
            'peonia/products'
          );

        images[i] = uploadedUrl;
      }
    }

    const product = await Product.create({
      name,
      slug: normalizedSlug,
      description,

      is_addon:
        String(is_addon) === 'true',
        is_featured:
    String(is_featured) === 'true',

  is_best_seller:
    String(is_best_seller) === 'true',

      price: Number(price || 0),

      sale_price: Number(
        sale_price || 0
      ),

      categoryId:
        categoryId || null,

      images,

      image_url:
        images[0] || '',
    });

    return res.status(201).json({
      message:
        'Tạo sản phẩm thành công.',
      product: toProductResponse(
        product
      ),
    });
  } catch (error) {
    console.error(
      'CREATE PRODUCT ERROR'
    );
    console.error(error);

    return res.status(500).json({
      message: 'Lỗi tạo sản phẩm.',
      error: error.message,
    });
  }
}

async function getProductsAdmin(req, res) {
  try {
    const { is_addon, category_slug, search = '', page = 1, limit = 20 } = req.query;
    const query = {};
    if (typeof is_addon !== 'undefined') query.is_addon = is_addon === 'true';
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];
    let productIds = null;
    if (category_slug) {
      const category = await Category.findOne({ slug: category_slug }).select('_id');
      if (category) {
        const links = await ProductCategory.find({ category_id: category._id }).select('product_id');
        productIds = links.map((item) => item.product_id);
      } else {
        productIds = [];
      }
    }
    if (productIds) query._id = { $in: productIds };
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 20, 1);
    const [items, total] = await Promise.all([paginate(Product.find(query).sort({ created_at: -1 }), pageNum, limitNum), Product.countDocuments(query)]);
   
    
   
    return res.json({
      data: items.map((item) =>
        toProductResponse(item)
      ),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        total_pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy sản phẩm.', error: error.message });
  }
}

async function updateProduct(req, res) {
  
  try {
    const { categoryId, image_url, ...payload } = req.body;

    // Chuẩn hóa slug tiếng Việt -> slug URL
    if (payload.slug) {
      payload.slug = slugify(payload.slug);
    }

    if (payload.slug && !validateSlug(payload.slug)) {
      return res.status(400).json({
        message: 'Slug sản phẩm không hợp lệ.',
      });
    }

    const currentProduct = await Product.findById(
      req.params.id
    );
    
    const images = [
      ...(currentProduct?.images || [])
    ];
    
    for (let i = 0; i < 4; i++) {
      const file =
        req.files?.[`image_${i}`]?.[0];
    
      if (file) {
        const uploadedUrl =
          await uploadImageFromBuffer(
            file,
            'peonia/products'
          );
    
        images[i] = uploadedUrl;
      }
    }
    
    payload.images = images;
    payload.image_url = images[0] || '';
    
    if (categoryId) {
      payload.categoryId = categoryId;
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm.',
      });
    }

    return res.json({
      message: 'Cập nhật sản phẩm thành công.',
      product: toProductResponse(product),
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR");
    console.error(error);
    return res.status(500).json({
      message: 'Lỗi cập nhật sản phẩm.',
      error: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    await ProductVariant.deleteMany({ product_id: product._id });
    await ProductCategory.deleteMany({ product_id: product._id });
    return res.json({ message: 'Xóa sản phẩm thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa sản phẩm.', error: error.message });
  }
}

async function createVariant(req, res) { /* unchanged */
  try {
    const { product_id, variant_name, price, sku } = req.body;
    if (!product_id || !variant_name || typeof price === 'undefined') {
      return res.status(400).json({ message: 'Thiếu product_id, variant_name hoặc price.' });
    }
    if (Number(price) < 0) return res.status(400).json({ message: 'Price không hợp lệ.' });
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    const variant = await ProductVariant.create({ product_id, variant_name, price, sku });
    return res.status(201).json({ message: 'Tạo biến thể thành công.', variant: toVariantResponse(variant) });
  } catch (error) { return res.status(500).json({ message: 'Lỗi tạo biến thể.', error: error.message }); }
}
async function getVariantsAdmin(req, res) { /* unchanged */
  try { const { product_id, search = '', page = 1, limit = 20 } = req.query; const query = {}; if (product_id) query.product_id = product_id; if (search) query.$or = [{ variant_name: { $regex: search, $options: 'i' } }, { sku: { $regex: search, $options: 'i' } }]; const pageNum = Math.max(Number(page) || 1, 1); const limitNum = Math.max(Number(limit) || 20, 1); const [items, total] = await Promise.all([paginate(ProductVariant.find(query).sort({ created_at: -1 }), pageNum, limitNum), ProductVariant.countDocuments(query)]); return res.json({ data: items.map(toVariantResponse), pagination: { page: pageNum, limit: limitNum, total, total_pages: Math.ceil(total / limitNum) } }); } catch (error) { return res.status(500).json({ message: 'Lỗi lấy biến thể.', error: error.message }); }
}
async function updateVariant(req, res) { /* unchanged */
  try { if (req.body.price !== undefined && Number(req.body.price) < 0) return res.status(400).json({ message: 'Price không hợp lệ.' }); const variant = await ProductVariant.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!variant) return res.status(404).json({ message: 'Không tìm thấy biến thể.' }); return res.json({ message: 'Cập nhật biến thể thành công.', variant: toVariantResponse(variant) }); } catch (error) { return res.status(500).json({ message: 'Lỗi cập nhật biến thể.', error: error.message }); }
}
async function deleteVariant(req, res) { /* unchanged */
  try { const variant = await ProductVariant.findByIdAndDelete(req.params.id); if (!variant) return res.status(404).json({ message: 'Không tìm thấy biến thể.' }); return res.json({ message: 'Xóa biến thể thành công.' }); } catch (error) { return res.status(500).json({ message: 'Lỗi xóa biến thể.', error: error.message }); }
}
async function createWorkshop(req, res) { /* unchanged */
  try { const { title, description, event_date, max_slots, available_slots, price } = req.body; if (!title || !event_date || !max_slots || typeof price === 'undefined') { return res.status(400).json({ message: 'Thiếu thông tin workshop bắt buộc.' }); } if (Number(max_slots) < 1 || Number(price) < 0) return res.status(400).json({ message: 'Dữ liệu workshop không hợp lệ.' }); const image_url = req.file ? await uploadImageFromBuffer(req.file, 'peonia/workshops') : req.body.image_url; const workshop = await Workshop.create({ title, description, event_date, max_slots, available_slots: available_slots ?? max_slots, price, image_url }); return res.status(201).json({ message: 'Tạo workshop thành công.', workshop: toWorkshopResponse(workshop) }); } catch (error) { return res.status(500).json({ message: 'Lỗi tạo workshop.', error: error.message }); }
}
async function getWorkshopsAdmin(req, res) { /* unchanged */
  try { const { search = '', status = 'all', page = 1, limit = 20 } = req.query; const query = {}; if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }]; if (status === 'available') query.available_slots = { $gt: 0 }; if (status === 'full') query.available_slots = 0; const pageNum = Math.max(Number(page) || 1, 1); const limitNum = Math.max(Number(limit) || 20, 1); const [items, total] = await Promise.all([paginate(Workshop.find(query).sort({ event_date: 1 }), pageNum, limitNum), Workshop.countDocuments(query)]); return res.json({ data: items.map(toWorkshopResponse), pagination: { page: pageNum, limit: limitNum, total, total_pages: Math.ceil(total / limitNum) } }); } catch (error) { return res.status(500).json({ message: 'Lỗi lấy workshop.', error: error.message }); }
}
async function updateWorkshop(req, res) { /* unchanged */
  try { if (req.body.max_slots !== undefined && Number(req.body.max_slots) < 1) return res.status(400).json({ message: 'max_slots không hợp lệ.' }); if (req.body.price !== undefined && Number(req.body.price) < 0) return res.status(400).json({ message: 'Price không hợp lệ.' }); const { image_url, ...payload } = req.body; if (req.file) payload.image_url = await uploadImageFromBuffer(req.file, 'peonia/workshops'); else if (typeof image_url !== 'undefined') payload.image_url = image_url; const workshop = await Workshop.findByIdAndUpdate(req.params.id, payload, { new: true }); if (!workshop) return res.status(404).json({ message: 'Không tìm thấy workshop.' }); return res.json({ message: 'Cập nhật workshop thành công.', workshop: toWorkshopResponse(workshop) }); } catch (error) { return res.status(500).json({ message: 'Lỗi cập nhật workshop.', error: error.message }); }
}
async function deleteWorkshop(req, res) { /* unchanged */
  try { const workshop = await Workshop.findByIdAndDelete(req.params.id); if (!workshop) return res.status(404).json({ message: 'Không tìm thấy workshop.' }); return res.json({ message: 'Xóa workshop thành công.' }); } catch (error) { return res.status(500).json({ message: 'Lỗi xóa workshop.', error: error.message }); }
}

async function getUsersAdmin(req, res) { /* unchanged */
  try { const { search = '', role, page = 1, limit = 50 } = req.query; const query = {}; if (role) query.role = role; if (search) query.$or = [{ username: { $regex: search, $options: 'i' } }, { full_name: { $regex: search, $options: 'i' } }]; const pageNum = Math.max(Number(page) || 1, 1); const limitNum = Math.max(Number(limit) || 50, 1); const [items, total] = await Promise.all([paginate(User.find(query).sort({ created_at: -1 }), pageNum, limitNum), User.countDocuments(query)]); return res.json({ data: items.map(toUserResponse), pagination: { page: pageNum, limit: limitNum, total, total_pages: Math.ceil(total / limitNum) } }); } catch (error) { return res.status(500).json({ message: 'Lỗi lấy danh sách tài khoản.', error: error.message }); }
}
async function updateUserAdmin(req, res) { /* unchanged */
  try { const { role, is_active, full_name } = req.body; const payload = {}; if (typeof full_name !== 'undefined') payload.full_name = full_name; if (typeof role !== 'undefined') payload.role = role; if (typeof is_active !== 'undefined') payload.is_active = is_active; const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true }).select('-password_hash'); if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản.' }); return res.json({ message: 'Cập nhật tài khoản thành công.', user: toUserResponse(user) }); } catch (error) { return res.status(500).json({ message: 'Lỗi cập nhật tài khoản.', error: error.message }); }
}

async function getWorkshopBookingsAdmin(req, res) {
  try {
    const { search = '', status, payment_status } = req.query;
    const query = {};
    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;
    if (search) query.$or = [
      { booking_code: { $regex: search, $options: 'i' } },
      { customer_name: { $regex: search, $options: 'i' } },
      { customer_phone: { $regex: search, $options: 'i' } },
    ];
    const bookings = await Booking.find(query).populate('workshop_id').sort({ created_at: -1 });
    return res.json({ data: bookings.map(toBookingResponse) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy booking workshop.', error: error.message });
  }
}

async function updateWorkshopBookingStatusAdmin(req, res) {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ booking_code: req.params.code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });
    if (status) booking.status = status;
    await booking.save();
    return res.json({ message: 'Cập nhật booking thành công.', booking: toBookingResponse(booking) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật booking.', error: error.message });
  }
}

async function deleteWorkshopBookingAdmin(req, res) {
  try {
    const booking = await Booking.findOneAndDelete({ booking_code: req.params.code });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking.' });
    return res.json({ message: 'Xóa booking thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa booking.', error: error.message });
  }
}

async function getShopOrdersAdmin(req, res) {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    const items = await OrderItem.find({ order_id: { $in: orders.map((o) => o._id) } });
    const grouped = items.reduce((acc, item) => { const key = String(item.order_id); if (!acc[key]) acc[key] = []; acc[key].push(item); return acc; }, {});
    return res.json({ data: orders.map((order) => toOrderResponse(order, grouped[String(order._id)] || [])) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy đơn hàng.', error: error.message });
  }
}

async function getShopOrderDetailAdmin(req, res) {
  try {
    const order = await Order.findOne({ order_code: req.params.code });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    const items = await OrderItem.find({ order_id: order._id });
    return res.json({ data: toOrderResponse(order, items) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng.', error: error.message });
  }
}

async function updateShopOrderStatusAdmin(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ order_code: req.params.code });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    if (status) order.status = status;
    await order.save();
    return res.json({ message: 'Cập nhật đơn hàng thành công.', data: toOrderResponse(order, []) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi cập nhật đơn hàng.', error: error.message });
  }
}

async function deleteShopOrderAdmin(req, res) {
  try {
    const order = await Order.findOneAndDelete({ order_code: req.params.code });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    await OrderItem.deleteMany({ order_id: order._id });
    return res.json({ message: 'Xóa đơn hàng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi xóa đơn hàng.', error: error.message });
  }
}

module.exports = {
  createCategory,
  getCategoriesAdmin,
  updateCategory,
  deleteCategory,
  createProduct,
  getProductsAdmin,
  updateProduct,
  deleteProduct,
  createVariant,
  getVariantsAdmin,
  updateVariant,
  deleteVariant,
  createWorkshop,
  getWorkshopsAdmin,
  updateWorkshop,
  deleteWorkshop,
  getUsersAdmin,
  updateUserAdmin,
  getWorkshopBookingsAdmin,
  updateWorkshopBookingStatusAdmin,
  deleteWorkshopBookingAdmin,
  getShopOrdersAdmin,
  getShopOrderDetailAdmin,
  updateShopOrderStatusAdmin,
  deleteShopOrderAdmin,
};
