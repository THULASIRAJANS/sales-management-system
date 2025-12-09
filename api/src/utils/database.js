const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('🔄 Loading database configuration...');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sales_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL database successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed!');
    console.error('Error:', err.message);
  });

module.exports = pool;
