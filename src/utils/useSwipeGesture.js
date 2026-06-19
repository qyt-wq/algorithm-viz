import { useEffect, useRef } from 'react';

/**
 * 触摸滑动手势 Hook
 * 水平滑动超过阈值时触发回调
 * @param {React.RefObject} ref — 监听的 DOM 元素
 * @param {Function} onSwipeLeft — 左滑回调（通常对应"前进"）
 * @param {Function} onSwipeRight — 右滑回调（通常对应"后退"）
 * @param {number} threshold — 触发阈值 (px)，默认 50
 */
export function useSwipeGesture(ref, onSwipeLeft, onSwipeRight, threshold = 50) {
  const touchStart = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;

      // 仅水平滑动占主导时触发
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= threshold) {
        if (dx < 0) onSwipeLeft?.();
        else onSwipeRight?.();
      }
      touchStart.current = null;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold]);
}
