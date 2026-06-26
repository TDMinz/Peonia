const Category = require('../models/category.model');
const Product = require('../models/product.model');
const ProductVariant = require('../models/productVariant.model');
const ProductCategory = require('../models/productCategory.model');

function toCategoryResponse(category) {
  return {
    id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    image_url: category.image_url,
    icon: category.icon,
    order: category.order,
    is_active: category.is_active,
    created_at: category.created_at,
    updated_at: category.updated_at,
  };
}

function pickImage(product) {
  if (product.images?.length) {
    return product.images[0];
  }

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

function toVariantResponse(variant, product = null) {
  return {
    id: variant._id,
    product: product
      ? {
          id: product._id,
          name: product.name,
          slug: product.slug,
          image_url: pickImage(product),
        }
      : variant.product_id,
    variant_name: variant.variant_name,
    price: variant.price,
    sku: variant.sku,
    created_at: variant.created_at,
  };
}

async function getCategories(req, res) { /* unchanged */
  try {
    const { parentSlug, parentId, is_active } = req.query;
    const query = {};
    if (typeof is_active !== 'undefined') query.is_active = is_active === 'true';
    if (parentId) query.parentId = parentId;
    if (parentSlug) {
      const parent = await Category.findOne({ slug: parentSlug }).select('_id');
      if (!parent) return res.json({ categories: [] });
      query.parentId = parent._id;
    }
    const categories = await Category.find(query).sort({ order: 1, name: 1 });
    return res.json({ categories: categories.map(toCategoryResponse) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy danh mục.', error: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const { is_addon, category_type, category_slug, categoryId, is_featured, is_best_seller, search = '' } = req.query;

    const query = {};
    if (typeof is_addon !== 'undefined') query.is_addon = is_addon === 'true';
    if (typeof is_featured !== 'undefined') query.is_featured = is_featured === 'true';
    if (typeof is_best_seller !== 'undefined') query.is_best_seller = is_best_seller === 'true';
    if (typeof categoryId !== 'undefined' && categoryId !== '') query.$or = [{ categoryId }, { category_ids: categoryId }];
    if (search) query.$or = [...(query.$or || []), { name: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }];

    let productIds = null;
    if (category_slug || category_type) {
      const categoryMatch = {};
      if (category_type) categoryMatch.type = category_type;
      if (category_slug) categoryMatch.slug = category_slug;
      const categories = await Category.find(categoryMatch).select('_id');
      const categoryIds = categories.map((item) => item._id);
      const links = await ProductCategory.find({ category_id: { $in: categoryIds } }).select('product_id');
      productIds = links.map((item) => item.product_id);
    }

    if (productIds) query._id = { $in: productIds };

    const products = await Product.find(query).sort({ created_at: -1 });
    const productIdsForVariants = products.map((product) => product._id);
    const variants = await ProductVariant.find({ product_id: { $in: productIdsForVariants } }).sort({ price: 1 });

    const variantMap = variants.reduce((acc, variant) => {
      const key = String(variant.product_id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(toVariantResponse(variant));
      return acc;
    }, {});

    return res.json({
      products: products.map((product) => ({
        ...toProductResponse(product),
        variants: variantMap[String(product._id)] || [],
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy sản phẩm.', error: error.message });
  }
}

async function getProductBySlug(req, res) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });

    const variants = await ProductVariant.find({ product_id: product._id }).sort({ price: 1 });
    const categoryLinks = await ProductCategory.find({ product_id: product._id }).populate('category_id');

    return res.json({
      product: toProductResponse(product),
      variants: variants.map((variant) => toVariantResponse(variant)),
      categories: categoryLinks.map((item) => toCategoryResponse(item.category_id)),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy chi tiết sản phẩm.', error: error.message });
  }
}

async function getProductVariants(req, res) { /* unchanged */
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });

    const variants = await ProductVariant.find({ product_id: req.params.id }).sort({ price: 1 });
    return res.json({
      product: toProductResponse(product),
      variants: variants.map((variant) => toVariantResponse(variant, product)),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy biến thể.', error: error.message });
  }
}

async function getProductsByCategorySlug(req, res) { /* unchanged */
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục.' });

    const productCategoryLinks = await ProductCategory.find({ category_id: category._id });
    const productIds = productCategoryLinks.map((item) => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } }).sort({ created_at: -1 });
    const variants = await ProductVariant.find({ product_id: { $in: productIds } }).sort({ price: 1 });

    const variantMap = variants.reduce((acc, variant) => {
      const key = String(variant.product_id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(toVariantResponse(variant));
      return acc;
    }, {});

    return res.json({
      category: toCategoryResponse(category),
      products: products.map((product) => ({
        ...toProductResponse(product),
        variants: variantMap[String(product._id)] || [],
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy sản phẩm theo danh mục.', error: error.message });
  }
}

async function getAddons(req, res) { /* unchanged */
  try {
    const products = await Product.find({ is_addon: true }).sort({ created_at: -1 });
    const productIds = products.map((product) => product._id);
    const variants = await ProductVariant.find({ product_id: { $in: productIds } }).sort({ price: 1 });

    const variantMap = variants.reduce((acc, variant) => {
      const key = String(variant.product_id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(toVariantResponse(variant));
      return acc;
    }, {});

    return res.json({
      products: products.map((product) => ({
        ...toProductResponse(product),
        variants: variantMap[String(product._id)] || [],
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy addon.', error: error.message });
  }
}

module.exports = {
  getCategories,
  getProducts,
  getProductBySlug,
  getProductVariants,
  getProductsByCategorySlug,
  getAddons,
};
