/**
 * 算法过程可视化系统 — Express 后端服务
 * 提供用户认证 API + 学习统计 API
 */
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// ---- 日志工具 ----
const LOG_DIR = path.join(__dirname, '..', 'logs');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function logToFile(level, message) {
  try {
    ensureLogDir();
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] ${message}\n`;
    // 按天滚动
    const date = timestamp.slice(0, 10);
    fs.appendFileSync(path.join(LOG_DIR, `server-${date}.log`), line);
  } catch {
    // 写日志失败不应影响主流程
  }
}

// 重定向 console.error 到文件（生产环境保留控制台输出 + 文件落盘）
const originalError = console.error;
console.error = (...args) => {
  originalError(...args);
  if (isProduction) {
    logToFile('ERROR', args.map(String).join(' '));
  }
};

// 请求日志中间件
app.use((req, _res, next) => {
  if (isProduction) {
    logToFile('INFO', `${req.method} ${req.url}`);
  }
  next();
});

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 全局错误处理
app.use((err, _req, res, _next) => {
  console.error('未捕获错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`✅ 后端服务已启动: http://localhost:${PORT}`);
  console.log(`   API 端点: http://localhost:${PORT}/api/auth`);
});
