const { pool } = require('../utils/database');
const QueryBuilder = require('../utils/queryBuilder');

class StatsService {
  // Get dashboard statistics
  async getStats(filters = {}) {
    try {
      const queryBuilder = new QueryBuilder();

      // Apply same filters as sales data
      if (filters.customerRegion) {
        queryBuilder.addCustomerRegionFilter(filters.customerRegion);
      }
      if (filters.gender) {
        queryBuilder.addGenderFilter(filters.gender);
      }
      if (filters.ageRange) {
        queryBuilder.addAgeRangeFilter(filters.ageRange);
      }
      if (filters.productCategory) {
        queryBuilder.addProductCategoryFilter(filters.productCategory);
      }
      if (filters.tags) {
        queryBuilder.addTagsFilter(filters.tags);
      }
      if (filters.paymentMethod) {
        queryBuilder.addPaymentMethodFilter(filters.paymentMethod);
      }
      if (filters.dateRange) {
        queryBuilder.addDateFilter(filters.dateRange);
      }

      const { clause: whereClause, params } = queryBuilder.buildWhereClause();

      const query = `
        SELECT 
          SUM(t.quantity) as total_units,
          SUM(t.final_amount) as total_amount,
          COUNT(DISTINCT t.transaction_id) as total_orders,
          SUM(t.discount_percentage * t.total_amount / 100) as total_discount,
          COUNT(DISTINCT CASE WHEN t.discount_percentage > 0 THEN t.transaction_id END) as discount_orders
        FROM transactions t
        INNER JOIN customers c ON t.customer_id = c.customer_id
        INNER JOIN products p ON t.product_id = p.product_id
        LEFT JOIN product_tags pt ON p.product_id = pt.product_id
        ${whereClause}
      `;

      const [rows] = await pool.query(query, params);
      
      return {
        totalUnits: rows[0].total_units || 0,
        totalAmount: rows[0].total_amount || 0,
        totalOrders: rows[0].total_orders || 0,
        totalDiscount: rows[0].total_discount || 0,
        discountOrders: rows[0].discount_orders || 0
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }
}

module.exports = new StatsService();
