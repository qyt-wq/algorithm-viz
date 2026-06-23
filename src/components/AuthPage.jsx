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
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 切换登录/注册模式
  const switchMode = (newMode) => {
    setMode(newMode);
    if (newMode === 'register') setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
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

      if (mode === 'register') {
        // 注册成功 → 跳转到登录界面，预填用户名
        setSuccessMsg(`注册成功！请使用账号 "${data.username}" 登录`);
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      } else {
        // 登录成功 → 保存 token，进入系统
        localStorage.setItem('auth_token', data.token);
        onLogin(data.username);
      }
    } catch {
      setError('无法连接服务器，请确认后端服务已启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-overlay">
      {/* 算法主题背景层 */}
      <div className="auth-bg-layer">
        <div className="auth-bg-node auth-bg-node-1" />
        <div className="auth-bg-node auth-bg-node-2" />
        <div className="auth-bg-node auth-bg-node-3" />
        <div className="auth-bg-node auth-bg-node-4" />
        <div className="auth-bg-node auth-bg-node-5" />
        <div className="auth-bg-node auth-bg-node-6" />
        <svg className="auth-bg-edges" viewBox="0 0 800 600" preserveAspectRatio="none">
          <line x1="120" y1="180" x2="280" y2="100" stroke="rgba(74,144,217,0.10)" strokeWidth="1.5" />
          <line x1="280" y1="100" x2="520" y2="140" stroke="rgba(74,144,217,0.08)" strokeWidth="1" />
          <line x1="280" y1="100" x2="380" y2="320" stroke="rgba(74,144,217,0.07)" strokeWidth="1" />
          <line x1="520" y1="140" x2="680" y2="280" stroke="rgba(74,144,217,0.09)" strokeWidth="1.2" />
          <line x1="120" y1="400" x2="380" y2="320" stroke="rgba(74,144,217,0.06)" strokeWidth="1" />
          <line x1="380" y1="320" x2="680" y2="280" stroke="rgba(74,144,217,0.08)" strokeWidth="1" />
          <line x1="680" y1="280" x2="620" y2="480" stroke="rgba(74,144,217,0.07)" strokeWidth="1" />
          <line x1="120" y1="400" x2="280" y2="520" stroke="rgba(74,144,217,0.06)" strokeWidth="1" />
          <line x1="280" y1="520" x2="620" y2="480" stroke="rgba(74,144,217,0.08)" strokeWidth="1" />
        </svg>
      </div>
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-card-icon">🧮</div>
          <div className="auth-card-subtitle">算法过程可视化系统</div>
          <div className="auth-card-title">{mode === 'login' ? '欢迎回来' : '创建账号'}</div>
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
          <div className="auth-field-group">
            <label className="auth-field-label">用户名</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">👤</span>
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
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">密码</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
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
          </div>

          {mode === 'register' && (
            <div className="auth-field-group">
              <label className="auth-field-label">确认密码</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
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
            </div>
          )}

          {successMsg && <div className="auth-success-msg">✅ {successMsg}</div>}
          {error && <div className="auth-error-msg">⚠️ {error}</div>}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? '⏳ 请稍候...' : mode === 'login' ? '🚀 登录' : '✨ 注册'}
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
