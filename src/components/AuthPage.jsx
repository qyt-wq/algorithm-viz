import { useState } from 'react';
import './AuthPage.css';

/**
 * 认证页面 — 登录 / 注册
 * @param {{ onLogin: (username: string) => void }} props
 */
export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 切换登录/注册模式
  const switchMode = (newMode) => {
    setMode(newMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  // 客户端输入校验
  const validate = () => {
    if (!username.trim()) return '用户名不能为空';
    if (username.length < 2) return '用户名长度至少 2 个字符';
    if (username.length > 50) return '用户名长度不能超过 50 个字符';
    if (!/^[a-zA-Z0-9_一-龥]+$/.test(username)) return '用户名只能包含字母、数字、下划线和中文';
    if (!password) return '密码不能为空';
    if (password.length < 3) return '密码长度至少 3 个字符';
    if (mode === 'register' && password !== confirmPassword) return '两次输入的密码不一致';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '请求失败，请重试');
        return;
      }

      // 登录/注册成功 — 保存 token，回调通知父组件
      localStorage.setItem('auth_token', data.token);
      onLogin(data.username);
    } catch {
      setError('无法连接服务器，请确认后端服务已启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-overlay">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-card-subtitle">算法过程可视化系统</div>
          <div className="auth-card-title">{mode === 'login' ? '登录' : '注册'}</div>
        </div>

        {/* 模式切换标签 */}
        <div className="auth-mode-tabs">
          <button
            className={`auth-mode-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
            type="button"
          >
            登录
          </button>
          <button
            className={`auth-mode-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
            type="button"
          >
            注册
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="auth-field-label">用户名</label>
            <input
              className={`auth-input ${error && !username.trim() ? 'input-error' : ''}`}
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div>
            <label className="auth-field-label">密码</label>
            <input
              className={`auth-input ${error && !password ? 'input-error' : ''}`}
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="auth-field-label">确认密码</label>
              <input
                className={`auth-input ${error && password !== confirmPassword ? 'input-error' : ''}`}
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="auth-error-msg">{error}</div>}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div className="auth-toggle-text">
          {mode === 'login' ? (
            <>
              还没有账号？
              <span className="auth-toggle-link" onClick={() => switchMode('register')}>
                立即注册
              </span>
            </>
          ) : (
            <>
              已有账号？
              <span className="auth-toggle-link" onClick={() => switchMode('login')}>
                返回登录
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
