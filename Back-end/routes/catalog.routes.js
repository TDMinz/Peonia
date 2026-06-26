const express = require('express');
const catalogController = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/categories', catalogController.getCategories);
router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.get('/products/:id/variants', catalogController.getProductVariants);
router.get('/products-by-category/:slug', catalogController.getProductsByCategorySlug);
router.get('/addons', catalogController.getAddons);

module.exports = router;
