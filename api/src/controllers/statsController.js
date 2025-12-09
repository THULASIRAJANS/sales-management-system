const statsService = require('../services/statsService');

class StatsController {
  // Get dashboard statistics
  async getStats(req, res) {
    try {
      const filters = {
        customerRegion: req.query.customerRegion ? JSON.parse(req.query.customerRegion) : null,
        gender: req.query.gender ? JSON.parse(req.query.gender) : null,
        ageRange: req.query.ageRange ? JSON.parse(req.query.ageRange) : null,
        productCategory: req.query.productCategory ? JSON.parse(req.query.productCategory) : null,
        tags: req.query.tags ? JSON.parse(req.query.tags) : null,
        paymentMethod: req.query.paymentMethod ? JSON.parse(req.query.paymentMethod) : null,
        dateRange: req.query.dateRange ? JSON.parse(req.query.dateRange) : null
      };

      const stats = await statsService.getStats(filters);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStats controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
}

module.exports = new StatsController();
