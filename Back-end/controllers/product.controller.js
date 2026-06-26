const Product = require('../models/product.model');

function pickImage(product) {
  if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
  return product.image_url || '';
}

function toProductResponse(product) {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    category_ids: product.category_ids || [],
    description: product.description,
    price: product.price,
    sale_price: product.sale_price,
    images: product.images || [],
    image_url: pickImage(product),
    is_featured: product.is_featured,
    is_best_seller: product.is_best_seller,
    is_active: product.is_active,
    is_addon: product.is_addon,
    created_at: product.created_at,
  };
}

async function getProducts(req, res) {
  try {
    const { categoryId, is_featured, is_best_seller, search = '' } = req.query;
    const query = { is_active: true };

    if (categoryId) query.categoryId = categoryId;
    if (typeof is_featured !== 'undefined') query.is_featured = is_featured === 'true';
    if (typeof is_best_seller !== 'undefined') query.is_best_seller = is_best_seller === 'true';
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];

    const products = await Product.find(query).sort({ created_at: -1 });
    return res.json({ products: products.map(toProductResponse) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh sách sản phẩm.', error: error.message });
  }
}

async function getProductBySlug(req, res) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, is_active: true });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    return res.json({ product: toProductResponse(product) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy chi tiết sản phẩm.', error: error.message });
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
};
