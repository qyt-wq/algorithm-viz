/**
 * MySQL connection pool
 * 配置优先从环境变量读取，否则使用默认值
 */
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'algorithm_viz',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

export default pool;
