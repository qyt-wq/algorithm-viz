/**
 * 学习统计路由 — 学习记录 / 登录统计 / 数据汇总
 * 优化版：合并聚合查询 + Promise.all 并行化 + 连接池友好
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'algorithm_viz_jwt_secret_2024';

// ---- JWT 鉴权中间件 ----
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ error: '无效的登录凭证' });
  }
}

// ---- POST /api/stats/learning — 记录一次算法执行 ----
router.post('/learning', authRequired, async (req, res) => {
  try {
    const { algorithmId, algorithmName, stepsCount } = req.body;
    const userId = req.user.id;

    if (!algorithmId || !algorithmName) {
      return res.status(400).json({ error: '算法信息不能为空' });
    }

    await pool.query(
      'INSERT INTO learning_records (user_id, algorithm_id, algorithm_name, steps_count) VALUES (?, ?, ?, ?)',
      [userId, algorithmId, algorithmName, stepsCount || 0]
    );

    res.json({ success: true, message: '学习记录已保存' });
  } catch (err) {
    console.error('保存学习记录失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ---- GET /api/stats/learning — 获取用户学习统计 ----
router.get('/learning', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    // 并行执行三条查询
    const [[[totalRow]], algoRows, [[recentRow]], recentAll] = await Promise.all([
      // 1. 总览：执行次数 + 总步骤
      pool.query(
        'SELECT COUNT(*) AS total, COALESCE(SUM(steps_count), 0) AS totalSteps FROM learning_records WHERE user_id = ?',
        [userId]
      ),
      // 2. 各算法分组统计
      pool.query(
        'SELECT algorithm_id, algorithm_name, COUNT(*) AS count, COALESCE(SUM(steps_count), 0) AS totalSteps, MAX(created_at) AS lastUsed FROM learning_records WHERE user_id = ? GROUP BY algorithm_id, algorithm_name ORDER BY count DESC',
        [userId]
      ),
      // 3. 最近记录
      pool.query(
        'SELECT id, algorithm_id, algorithm_name, steps_count, created_at FROM learning_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
        [userId]
      ),
    ]);

    res.json({
      total: totalRow?.total || 0,
      totalSteps: totalRow?.totalSteps || 0,
      algorithms: algoRows[0],
      recent: recentAll[0],
    });
  } catch (err) {
    console.error('获取学习统计失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ---- GET /api/stats/login — 获取登录统计 ----
router.get('/login', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    // 合并 COUNT + MIN + MAX 为一条查询，与最近记录并行
    const [[[summary]], recentAll] = await Promise.all([
      pool.query(
        'SELECT COUNT(*) AS totalLogins, MIN(login_at) AS firstLogin, MAX(login_at) AS lastLogin FROM login_records WHERE user_id = ?',
        [userId]
      ),
      pool.query(
        'SELECT id, login_at FROM login_records WHERE user_id = ? ORDER BY login_at DESC LIMIT 20',
        [userId]
      ),
    ]);

    res.json({
      totalLogins: summary?.totalLogins || 0,
      firstLogin: summary?.firstLogin || null,
      lastLogin: summary?.lastLogin || null,
      recent: recentAll[0],
    });
  } catch (err) {
    console.error('获取登录统计失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ---- POST /api/stats/heartbeat — 心跳上报学习时长（每30秒）----
router.post('/heartbeat', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const { seconds } = req.body;

    if (!seconds || seconds <= 0) {
      return res.json({ success: true });
    }

    await pool.query(
      `INSERT INTO user_stats (user_id, total_learning_seconds)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE total_learning_seconds = total_learning_seconds + VALUES(total_learning_seconds)`,
      [userId, seconds]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('心跳上报失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ---- POST /api/stats/heartbeat-beacon — sendBeacon 上报（token 在 body）----
router.post('/heartbeat-beacon', async (req, res) => {
  try {
    const { token, seconds } = req.body;
    if (!token || !seconds || seconds <= 0) {
      return res.json({ success: true });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch {
      return res.json({ success: true });
    }

    await pool.query(
      `INSERT INTO user_stats (user_id, total_learning_seconds)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE total_learning_seconds = total_learning_seconds + VALUES(total_learning_seconds)`,
      [userId, seconds]
    );

    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
});

// ---- GET /api/stats/cumulative — 获取累计学习时长 ----
router.get('/cumulative', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const [[row]] = await pool.query(
      'SELECT total_learning_seconds FROM user_stats WHERE user_id = ?',
      [userId]
    );
    res.json({
      totalSeconds: row?.total_learning_seconds || 0,
    });
  } catch (err) {
    console.error('获取累计时长失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ---- GET /api/stats/summary — 综合统计概览 ----
// 4 条并行查询 → 合并为 3 条（learning 子查询合并 COUNT + favorite）
router.get('/summary', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    // 3 路并行：合并 learning_records 两查为一条子查询
    const [[[learnRow]], [[loginRow]], [[cumRow]]] = await Promise.all([
      // 合并：学习总次数 + 算法种类数 + 最爱算法
      pool.query(
        `SELECT
           COUNT(*) AS total,
           COUNT(DISTINCT algorithm_id) AS algoCount,
           (SELECT algorithm_name FROM learning_records
            WHERE user_id = ?
            GROUP BY algorithm_name
            ORDER BY COUNT(*) DESC LIMIT 1
           ) AS favoriteAlgorithm
         FROM learning_records WHERE user_id = ?`,
        [userId, userId]
      ),
      // 合并：登录次数 + 最近登录 + 登录天数
      pool.query(
        `SELECT
           COUNT(*) AS totalLogins,
           MAX(login_at) AS lastLogin,
           COUNT(DISTINCT DATE(login_at)) AS totalLoginDays
         FROM login_records WHERE user_id = ?`,
        [userId]
      ),
      // 累计时长
      pool.query(
        'SELECT total_learning_seconds FROM user_stats WHERE user_id = ?',
        [userId]
      ),
    ]);

    res.json({
      totalExecutions: learnRow?.total || 0,
      uniqueAlgorithms: learnRow?.algoCount || 0,
      totalLogins: loginRow?.totalLogins || 0,
      totalLoginDays: loginRow?.totalLoginDays || 0,
      totalLearningSeconds: cumRow?.total_learning_seconds || 0,
      lastLogin: loginRow?.lastLogin || null,
      favoriteAlgorithm: learnRow?.favoriteAlgorithm || null,
    });
  } catch (err) {
    console.error('获取统计概览失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
