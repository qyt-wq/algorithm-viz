const BAR_COLORS = {
  default: '#a29bfe',
  leftRange: '#6c5ce7',
  rightRange: '#fd79a8',
  comparing: '#fdcb6e',
  merging: '#00b894',
  sorted: '#55efc4',
};

export default function MergeSortViz({ step }) {
  const data = step.data || [];
  const maxVal = Math.max(...data, 1);

  const sortedSet = new Set();
  if (step.sorted) step.sorted.forEach((i) => sortedSet.add(i));
  if (step.type === 'complete') data.forEach((_, i) => sortedSet.add(i));

  const getColor = (idx) => {
    if (sortedSet.has(idx)) return BAR_COLORS.sorted;
    if (step.comparing?.includes(idx)) return BAR_COLORS.comparing;
    if (step.merging?.includes(idx)) return BAR_COLORS.merging;
    // 显示子数组范围
    if (step.type === 'divide' || step.type === 'merge-compare' || step.type === 'merge-place' || step.type === 'merge-complete') {
      if (step.left !== undefined && step.mid !== undefined && step.right !== undefined) {
        if (idx >= step.left && idx <= step.mid) return BAR_COLORS.leftRange;
        if (idx > step.mid && idx <= step.right) return BAR_COLORS.rightRange;
      }
    }
    return BAR_COLORS.default;
  };

  const rangeLabel =
    step.left !== undefined && step.right !== undefined && step.type !== 'init' && step.type !== 'complete'
      ? `arr[${step.left}..${step.right}]${step.mid >= 0 ? `  |  左[${step.left}..${step.mid}]  右[${step.mid + 1}..${step.right}]` : ''}`
      : null;

  return (
    <div className="mergesort-viz">
      {rangeLabel && <div className="merge-range-label">{rangeLabel}</div>}
      <div className="bars-container">
        {data.map((val, idx) => {
          const h = (val / maxVal) * 100;
          const color = getColor(idx);
          const glow = step.comparing?.includes(idx) || step.merging?.includes(idx) || sortedSet.has(idx);
          return (
            <div key={idx} className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: `${h}%`,
                  backgroundColor: color,
                  filter: glow ? 'brightness(1.25) drop-shadow(0 0 6px rgba(255,255,255,0.15))' : undefined,
                }}
              >
                <span className="bar-value">{val}</span>
              </div>
              <span className="bar-index">{idx}</span>
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.leftRange }} /> 左子数组</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.rightRange }} /> 右子数组</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.comparing }} /> 比较中</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.merging }} /> 放置中</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.sorted }} /> 已有序</div>
      </div>
    </div>
  );
}
