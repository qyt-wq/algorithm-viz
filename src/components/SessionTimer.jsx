import { useState, useEffect, useRef } from 'react';

const HEARTBEAT_INTERVAL = 30; // 每30秒上报一次

/**
 * 顶部右上角本次学习计时器 + 后台心跳上报累计时长
 */
export default function SessionTimer() {
  const [elapsed, setElapsed] = useState(0); // 本次会话秒数
  const pendingRef = useRef(0);              // 待上报的秒数

  // 实时显示计时（每秒更新）
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 心跳上报（后台）
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const sendHeartbeat = (secs) => {
      if (secs <= 0) return;
      fetch('/api/stats/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seconds: secs }),
        keepalive: true,
      }).catch(() => {});
      pendingRef.current = 0;
    };

    const interval = setInterval(() => {
      pendingRef.current += HEARTBEAT_INTERVAL;
      sendHeartbeat(HEARTBEAT_INTERVAL);
    }, HEARTBEAT_INTERVAL * 1000);

    const handleUnload = () => {
      const remaining = pendingRef.current;
      if (remaining <= 0) return;
      navigator.sendBeacon?.(
        '/api/stats/heartbeat-beacon',
        JSON.stringify({ token, seconds: Math.min(remaining, HEARTBEAT_INTERVAL) })
      );
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      sendHeartbeat(pendingRef.current);
    };
  }, []);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <span className="session-timer" title="本次学习时长">
      ⏱ {h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`}
    </span>
  );
}
