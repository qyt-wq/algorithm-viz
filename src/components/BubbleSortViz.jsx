const BAR_COLORS = {
  default: '#6c5ce7',
  comparing: '#fdcb6e',
  swapping: '#e17055',
  sorted: '#00b894',
};

export default function BubbleSortViz({ step }) {
  const data = step.data || [];
  const maxVal = Math.max(...data, 1);
  const n = data.length;

  const sortedSet = new Set();
  if (step.sorted) step.sorted.forEach((i) => sortedSet.add(i));
  if (step.type === 'complete') data.forEach((_, i) => sortedSet.add(i));

  const getColor = (idx) => {
    if (sortedSet.has(idx)) return BAR_COLORS.sorted;
    if (step.swapping?.includes(idx)) return BAR_COLORS.swapping;
    if (step.comparing?.includes(idx)) return BAR_COLORS.comparing;
    return BAR_COLORS.default;
  };

  return (
    <div className="bubblesort-viz">
      {step.pass > 0 && step.type !== 'complete' && (
        <div className="pass-indicator">第 {step.pass} 轮冒泡</div>
      )}
      <div className="bars-container">
        {data.map((val, idx) => {
          const h = (val / maxVal) * 100;
          const color = getColor(idx);
          const glow = step.comparing?.includes(idx) || step.swapping?.includes(idx) || sortedSet.has(idx);
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
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.comparing }} /> 比较中</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.swapping }} /> 交换中</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.sorted }} /> 已归位</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: BAR_COLORS.default }} /> 未处理</div>
      </div>
    </div>
  );
}
