const express = require('express');
const catalogController = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/', catalogController.getProducts);
router.get('/:slug', catalogController.getProductBySlug);

module.exports = router;
