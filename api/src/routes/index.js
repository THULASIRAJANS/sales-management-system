const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Sales routes
router.get('/sales', salesController.getSalesData);

// Add other routes here
// router.post('/sales', salesController.createSale);
// router.get('/stats', salesController.getStats);

module.exports = router;
