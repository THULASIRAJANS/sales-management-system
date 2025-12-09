const { pool } = require('../utils/database');
const QueryBuilder = require('../utils/queryBuilder');

class SalesService {
  // Get all sales data with filters
  async getSalesData(filters) {
    try {
      const queryBuilder = new QueryBuilder();

      // Apply filters
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
      if (filters.search) {
        queryBuilder.addSearchFilter(filters.search);
      }

      const { clause: whereClause, params } = queryBuilder.buildWhereClause();
      const orderByClause = queryBuilder.buildOrderByClause(filters.sortBy);

      // Main query with all joins
      const query = `
        SELECT DISTINCT
          t.transaction_id,
          t.date,
          c.customer_id,
          c.customer_name,
          c.phone_number,
          c.gender,
          c.age,
          p.product_category,
          t.quantity,
          t.final_amount as total_amount,
          t.discount_percentage * t.total_amount / 100 as discount,
          c.customer_region,
          p.product_id,
          s.employee_name
        FROM transactions t
        INNER JOIN customers c ON t.customer_id = c.customer_id
        INNER JOIN products p ON t.product_id = p.product_id
        LEFT JOIN salespersons s ON t.salesperson_id = s.salesperson_id
        LEFT JOIN product_tags pt ON p.product_id = pt.product_id
        ${whereClause}
        ORDER BY ${orderByClause}
      `;

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error in getSalesData:', error);
      throw error;
    }
  }

  // Get paginated sales data
  async getPaginatedSalesData(filters, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const data = await this.getSalesData(filters);
      
      return {
        data: data.slice(offset, offset + limit),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(data.length / limit),
          totalRecords: data.length,
          limit
        }
      };
    } catch (error) {
      console.error('Error in getPaginatedSalesData:', error);
      throw error;
    }
  }
}

module.exports = new SalesService();
