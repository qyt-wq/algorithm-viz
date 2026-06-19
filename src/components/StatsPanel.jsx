import { useState, useEffect } from 'react';
import { formatDuration } from '../utils/formatDuration';

/**
 * 学习统计面板 — 展示用户的学习和登录数据
 * @param {{ refreshKey: number }} props — refreshKey 变化时重新拉取数据
 */
export default function StatsPanel({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      try {
        const res = await fetch('/api/stats/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // 静默失败 — 统计不是核心功能
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchStats();
  }, [refreshKey]);

  if (loading && !stats) {
    return (
      <div className="panel stats-panel">
        <h3 className="panel-title">📊 学习统计</h3>
        <div className="stats-loading">加载中...</div>
      </div>
    );
  }

  if (!stats || stats.totalExecutions === 0) {
    return (
      <div className="panel stats-panel">
        <h3 className="panel-title">📊 学习统计</h3>
        <div className="stats-empty">
          <span className="stats-empty-icon">🚀</span>
          <p>执行算法后开始记录学习数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel stats-panel">
      <h3 className="panel-title">📊 学习统计</h3>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.totalExecutions}</span>
          <span className="stat-label">执行次数</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.uniqueAlgorithms}</span>
          <span className="stat-label">算法种类</span>
        </div>
        <div className="stat-item">
          <span className="stat-value stat-value-sm">{formatDuration(stats.totalLearningSeconds)}</span>
          <span className="stat-label">累计学习时长</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.totalLoginDays ?? '--'}</span>
          <span className="stat-label">累计登录天数</span>
        </div>
      </div>

      {stats.favoriteAlgorithm && (
        <div className="stats-fav">
          <span className="stats-fav-icon">⭐</span>
          <span>最爱算法：</span>
          <strong>{stats.favoriteAlgorithm}</strong>
        </div>
      )}
    </div>
  );
}
