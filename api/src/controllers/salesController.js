const db = require("../utils/database");
const QueryBuilder = require("../utils/queryBuilder");

exports.getSalesData = async (req, res) => {
  let connection;
  try {
    console.log("🚀 ===== SALES DATA REQUEST =====");
    console.log("�� Query params:", JSON.stringify(req.query, null, 2));

    connection = await db.getConnection();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      customerRegion: req.query.customerRegion ? JSON.parse(req.query.customerRegion) : [],
      gender: req.query.gender ? JSON.parse(req.query.gender) : [],
      ageRange: req.query.ageRange ? JSON.parse(req.query.ageRange) : [],
      productCategory: req.query.productCategory ? JSON.parse(req.query.productCategory) : [],
      tags: req.query.tags ? JSON.parse(req.query.tags) : [],
      paymentMethod: req.query.paymentMethod ? JSON.parse(req.query.paymentMethod) : [],
      dateRange: req.query.dateRange ? JSON.parse(req.query.dateRange) : null,
      search: req.query.search || "",
      sortBy: req.query.sortBy || "date-desc",
    };

    const queryBuilder = new QueryBuilder();
    queryBuilder
      .addCustomerRegionFilter(filters.customerRegion)
      .addGenderFilter(filters.gender)
      .addAgeRangeFilter(filters.ageRange)
      .addProductCategoryFilter(filters.productCategory)
      .addTagsFilter(filters.tags)
      .addPaymentMethodFilter(filters.paymentMethod)
      .addDateFilter(filters.dateRange)
      .addSearchFilter(filters.search);

    const { clause: whereClause, params: whereParams } = queryBuilder.buildWhereClause();
    const orderByClause = queryBuilder.buildOrderByClause(filters.sortBy);

    // FIXED: Added JOIN with salespersons table
    const baseQuery = `
      FROM transactions t
      INNER JOIN customers c ON t.customer_id = c.customer_id
      INNER JOIN products p ON t.product_id = p.product_id
      LEFT JOIN salespersons s ON t.salesperson_id = s.salesperson_id
      LEFT JOIN product_tags pt ON p.product_id = pt.product_id
      ${whereClause}
    `;

    const countQuery = `SELECT COUNT(DISTINCT t.transaction_id) as total ${baseQuery}`;
    const [[{ total }]] = await connection.query(countQuery, whereParams);

    // FIXED: Now using s.employee_name from salespersons table
    const dataQuery = `
      SELECT DISTINCT
        t.transaction_id,
        t.date,
        t.customer_id,
        c.customer_name,
        c.phone_number,
        c.gender,
        c.age,
        p.product_category,
        t.quantity,
        t.final_amount as total_amount,
        c.customer_region,
        t.product_id,
        s.employee_name,
        t.payment_method,
        t.order_status
      ${baseQuery}
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await connection.query(dataQuery, [...whereParams, limit, offset]);

    const statsQuery = `
      SELECT
        SUM(t.quantity) as totalUnits,
        SUM(t.final_amount) as totalAmount,
        SUM(t.total_amount - t.final_amount) as totalDiscount,
        COUNT(DISTINCT t.transaction_id) as totalOrders,
        COUNT(DISTINCT CASE WHEN t.discount_percentage > 0 THEN t.transaction_id END) as discountOrders
      ${baseQuery}
    `;

    const [[stats]] = await connection.query(statsQuery, whereParams);

    res.json({
      success: true,
      data: rows,
      stats: {
        totalUnits: stats.totalUnits || 0,
        totalAmount: stats.totalAmount || 0,
        totalDiscount: stats.totalDiscount || 0,
        totalOrders: stats.totalOrders || 0,
        discountOrders: stats.discountOrders || 0,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: limit,
      },
    });

    console.log("✅ ===== REQUEST COMPLETED =====\n");
  } catch (error) {
    console.error("❌ Error in getSalesData:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sales data",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
      console.log("🔌 Database connection released");
    }
  }
};
