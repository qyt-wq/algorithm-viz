/**
 * 学习统计路由 — 学习记录 / 登录统计 / 数据汇总
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

    // 总执行次数、完成次数
    const [totalRows] = await pool.query(
      'SELECT COUNT(*) AS total, SUM(steps_count) AS totalSteps FROM learning_records WHERE user_id = ?',
      [userId]
    );

    // 各算法执行次数
    const [algoRows] = await pool.query(
      'SELECT algorithm_id, algorithm_name, COUNT(*) AS count, SUM(steps_count) AS totalSteps, MAX(created_at) AS lastUsed FROM learning_records WHERE user_id = ? GROUP BY algorithm_id, algorithm_name ORDER BY count DESC',
      [userId]
    );

    // 最近 10 条记录
    const [recentRows] = await pool.query(
      'SELECT id, algorithm_id, algorithm_name, steps_count, created_at FROM learning_records WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    res.json({
      total: totalRows[0].total || 0,
      totalSteps: totalRows[0].totalSteps || 0,
      algorithms: algoRows,
      recent: recentRows,
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

    // 总登录次数
    const [countRows] = await pool.query(
      'SELECT COUNT(*) AS total FROM login_records WHERE user_id = ?',
      [userId]
    );

    // 首次和最近登录
    const [timeRows] = await pool.query(
      'SELECT MIN(login_at) AS firstLogin, MAX(login_at) AS lastLogin FROM login_records WHERE user_id = ?',
      [userId]
    );

    // 最近 20 条登录记录
    const [recentRows] = await pool.query(
      'SELECT id, login_at FROM login_records WHERE user_id = ? ORDER BY login_at DESC LIMIT 20',
      [userId]
    );

    res.json({
      totalLogins: countRows[0].total || 0,
      firstLogin: timeRows[0].firstLogin || null,
      lastLogin: timeRows[0].lastLogin || null,
      recent: recentRows,
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
    const { seconds } = req.body; // 本次增加的秒数

    if (!seconds || seconds <= 0) {
      return res.json({ success: true });
    }

    // upsert：不存在则插入，存在则累加
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
      return res.json({ success: true }); // token 无效，静默忽略
    }

    await pool.query(
      `INSERT INTO user_stats (user_id, total_learning_seconds)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE total_learning_seconds = total_learning_seconds + VALUES(total_learning_seconds)`,
      [userId, seconds]
    );

    res.json({ success: true });
  } catch {
    res.json({ success: true }); // 永远不报错
  }
});

// ---- GET /api/stats/cumulative — 获取累计学习时长 ----
router.get('/cumulative', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      'SELECT total_learning_seconds FROM user_stats WHERE user_id = ?',
      [userId]
    );
    res.json({
      totalSeconds: rows.length > 0 ? rows[0].total_learning_seconds : 0,
    });
  } catch (err) {
    console.error('获取累计时长失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ---- GET /api/stats/summary — 综合统计概览 ----
router.get('/summary', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;

    // 并行查询所有统计
    const [learnCount] = await pool.query(
      'SELECT COUNT(*) AS total, COUNT(DISTINCT algorithm_id) AS algoCount FROM learning_records WHERE user_id = ?',
      [userId]
    );
    const [loginCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM login_records WHERE user_id = ?',
      [userId]
    );
    const [lastLogin] = await pool.query(
      'SELECT MAX(login_at) AS lastLogin FROM login_records WHERE user_id = ?',
      [userId]
    );
    const [loginDays] = await pool.query(
      'SELECT COUNT(DISTINCT DATE(login_at)) AS days FROM login_records WHERE user_id = ?',
      [userId]
    );
    const [favAlgo] = await pool.query(
      'SELECT algorithm_name, COUNT(*) AS cnt FROM learning_records WHERE user_id = ? GROUP BY algorithm_name ORDER BY cnt DESC LIMIT 1',
      [userId]
    );
    const [cumulative] = await pool.query(
      'SELECT total_learning_seconds FROM user_stats WHERE user_id = ?',
      [userId]
    );

    res.json({
      totalExecutions: learnCount[0].total || 0,
      uniqueAlgorithms: learnCount[0].algoCount || 0,
      totalLogins: loginCount[0].total || 0,
      totalLoginDays: loginDays[0].days || 0,
      totalLearningSeconds: cumulative.length > 0 ? cumulative[0].total_learning_seconds : 0,
      lastLogin: lastLogin[0]?.lastLogin || null,
      favoriteAlgorithm: favAlgo[0]?.algorithm_name || null,
    });
  } catch (err) {
    console.error('获取统计概览失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
