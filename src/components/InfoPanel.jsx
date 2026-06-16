export default function InfoPanel({ algorithm, currentStep, inputData }) {
  const timeComplexity = algorithm.timeComplexity || '';
  const spaceComplexity = algorithm.spaceComplexity || '';

  const getFinalResult = () => {
    if (!currentStep || currentStep.type !== 'complete') return null;
    if (algorithm.id === 'quicksort') {
      return `排序结果: [${currentStep.data.join(', ')}]`;
    }
    if (algorithm.id === 'dijkstra') {
      const dists = currentStep.distances;
      if (!dists) return null;
      return Object.entries(dists).map(([n, d]) => `${n}=${d === Infinity ? '∞' : d}`).join(', ');
    }
    if (algorithm.id === 'hanoi') {
      const total = Object.values(currentStep.pegs).reduce((s, p) => s + p.length, 0);
      const match = currentStep.description.match(/(\d+)/);
      return `${match?.[1] || '?'} 步完成（${total} 盘理论最少 ${Math.pow(2, total) - 1} 步）`;
    }
    return null;
  };

  const finalResult = getFinalResult();

  return (
    <div className="panel">
      <h3 className="panel-title">📖 {algorithm.name}</h3>
      <p className="info-text">{algorithm.description}</p>

      <h4 className="section-subtitle">复杂度</h4>
      <div className="complexity-row">
        <span className="complexity-label">时间</span>
        <span className="complexity-value">{timeComplexity}</span>
      </div>
      <div className="complexity-row">
        <span className="complexity-label">空间</span>
        <span className="complexity-value">{spaceComplexity}</span>
      </div>

      {inputData !== null && (
        <>
          <h4 className="section-subtitle">输入数据</h4>
          <p className="info-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--color-bg)', padding: '4px 8px', borderRadius: '4px' }}>
            {Array.isArray(inputData) ? `[${inputData.join(', ')}]` : String(inputData)}
          </p>
        </>
      )}

      {finalResult && <div className="result-box" style={{ marginTop: '8px' }}>{finalResult}</div>}
    </div>
  );
}
