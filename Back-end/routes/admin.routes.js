const express = require('express');
const adminController = require('../controllers/admin.controller');
const upload = require('../middlewares/upload.middleware');
const { authRequired, allowRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authRequired, allowRoles('super_admin', 'staff'));

router.get('/categories', adminController.getCategoriesAdmin);
router.post('/categories', adminController.createCategory);
router.patch('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

router.get('/products', adminController.getProductsAdmin);
router.post('/products', upload.fields([ { name: 'image_0', maxCount: 1 }, { name: 'image_1', maxCount: 1 }, { name: 'image_2', maxCount: 1 }, { name: 'image_3', maxCount: 1 }, ]), adminController.createProduct);
router.patch('/products/:id', upload.fields([ { name: 'image_0', maxCount: 1 }, { name: 'image_1', maxCount: 1 }, { name: 'image_2', maxCount: 1 }, { name: 'image_3', maxCount: 1 }, ]), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/variants', adminController.getVariantsAdmin);
router.post('/variants', adminController.createVariant);
router.patch('/variants/:id', adminController.updateVariant);
router.delete('/variants/:id', adminController.deleteVariant);

router.get('/workshops', adminController.getWorkshopsAdmin);
router.post('/workshops', upload.single('image'), adminController.createWorkshop);
router.patch('/workshops/:id', upload.single('image'), adminController.updateWorkshop);
router.delete('/workshops/:id', adminController.deleteWorkshop);

router.get('/users', adminController.getUsersAdmin);
router.patch('/users/:id', adminController.updateUserAdmin);

router.get('/workshop-bookings', adminController.getWorkshopBookingsAdmin);
router.patch('/workshop-bookings/:code/status', adminController.updateWorkshopBookingStatusAdmin);
router.delete('/workshop-bookings/:code', adminController.deleteWorkshopBookingAdmin);

router.get('/shop-orders', adminController.getShopOrdersAdmin);
router.get('/shop-orders/:code', adminController.getShopOrderDetailAdmin);
router.patch('/shop-orders/:code/status', adminController.updateShopOrderStatusAdmin);
router.delete('/shop-orders/:code', adminController.deleteShopOrderAdmin);

module.exports = router;
