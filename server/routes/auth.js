/**
 * 认证路由 — 注册 / 登录 / 验证
 */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'algorithm_viz_jwt_secret_2024';
const JWT_EXPIRES = '7d';
const BCRYPT_ROUNDS = 10;

// 生成 JWT
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 输入验证
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (username.length < 2 || username.length > 50) {
      return res.status(400).json({ error: '用户名长度需在 2-50 个字符之间' });
    }
    if (password.length < 3) {
      return res.status(400).json({ error: '密码长度不能少于 3 个字符' });
    }
    if (!/^[a-zA-Z0-9_一-龥]+$/.test(username)) {
      return res.status(400).json({ error: '用户名只能包含字母、数字、下划线和中文' });
    }

    // 检查用户名是否已存在
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: '用户名已存在' });
    }

    // 哈希密码并插入
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );

    const user = { id: result.insertId, username };

    // 记录首次登录
    await pool.query(
      'INSERT INTO login_records (user_id) VALUES (?)',
      [user.id]
    );

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      username,
    });
  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    // 查找用户
    const [rows] = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const user = rows[0];

    // 比较密码
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: '密码错误' });
    }

    // 记录登录
    await pool.query(
      'INSERT INTO login_records (user_id) VALUES (?)',
      [user.id]
    );

    const token = generateToken(user);

    res.json({
      success: true,
      message: '登录成功',
      token,
      username: user.username,
    });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

// GET /api/auth/me — 验证 token 是否有效
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未登录' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({ username: decoded.username });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ error: '无效的登录凭证' });
  }
});

export default router;
