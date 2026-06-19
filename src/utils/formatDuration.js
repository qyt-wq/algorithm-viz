/**
 * 格式化秒数为可读字符串
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 60) return '刚刚';
  const min = Math.floor(seconds / 60);
  if (min < 60) return `${min} 分钟`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `${h} 小时`;
  return `${h} 小时 ${m} 分`;
}
