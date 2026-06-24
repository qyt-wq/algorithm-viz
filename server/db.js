/**
 * MySQL connection pool — 生产级配置
 * 配置优先从环境变量读取，否则使用默认值
 */
import mysql from 'mysql2/promise';

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'algorithm_viz',

  // ---- 连接池容量 ----
  connectionLimit: isProduction ? 20 : 10,
  queueLimit: 20,
  waitForConnections: true,

  // ---- 超时控制 ----
  connectTimeout: 5000,     // 建立 TCP 连接超时 5s
  acquireTimeout: 10000,    // 从池中获取连接最长等 10s
  idleTimeout: 60000,       // 空闲连接 60s 后释放

  // ---- TCP Keep-Alive（防止 NAT/防火墙切断空闲连接）----
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,

  // ---- 编码 ----
  charset: 'utf8mb4',
});

// ---- 连接池事件监控 ----
pool.on('acquire', (conn) => {
  // 连接被取出使用（生产环境可接入 APM）
  if (isProduction) {
    const usage = (pool._allConnections?.length || 0) - (pool._freeConnections?.length || 0);
    if (usage >= 18) {
      console.warn(`[DB] 连接池高水位: 活跃=${usage}`);
    }
  }
});

pool.on('connection', () => {
  // 新连接建立（仅首次新建时触发）
});

pool.on('release', () => {
  // 连接归还池中
});

pool.on('error', (err) => {
  console.error('[DB] 连接池错误:', err.message);
});

export default pool;
