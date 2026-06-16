import { useState, useCallback } from 'react';

function generateRandomData(algorithm) {
  if (algorithm.id === 'quicksort') {
    const count = Math.floor(Math.random() * (algorithm.randomCount.max - algorithm.randomCount.min + 1)) + algorithm.randomCount.min;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(Math.floor(Math.random() * (algorithm.randomRange.max - algorithm.randomRange.min + 1)) + algorithm.randomRange.min);
    }
    return arr;
  }
  if (algorithm.id === 'dijkstra') {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    return nodes[Math.floor(Math.random() * nodes.length)];
  }
  if (algorithm.id === 'hanoi') {
    return Math.floor(Math.random() * (algorithm.randomRange.max - algorithm.randomRange.min + 1)) + algorithm.randomRange.min;
  }
  return null;
}

export default function DataInput({ algorithm, onRun, disabled, testCases }) {
  const [inputMode, setInputMode] = useState('manual');
  const [manualValue, setManualValue] = useState('');
  const [error, setError] = useState('');

  const parseAndValidate = useCallback((raw) => {
    setError('');
    if (algorithm.id === 'quicksort') {
      const parts = raw.split(/[,，\s]+/).filter(Boolean);
      const nums = parts.map(Number);
      const invalid = nums.filter((n) => isNaN(n) || !Number.isInteger(n));
      if (parts.length === 0 || invalid.length > 0) { setError('请输入用逗号分隔的整数'); return null; }
      if (nums.length < 2) { setError('至少需要2个元素'); return null; }
      if (nums.length > 20) { setError('最多20个元素'); return null; }
      return nums;
    }
    if (algorithm.id === 'dijkstra') {
      const val = raw.trim().toUpperCase();
      if (!['A','B','C','D','E','F','G'].includes(val)) { setError('请输入有效节点（A-G）'); return null; }
      return val;
    }
    if (algorithm.id === 'hanoi') {
      const n = parseInt(raw.trim(), 10);
      if (isNaN(n) || n < 2 || n > 8) { setError('请输入2-8之间的整数'); return null; }
      return n;
    }
    return null;
  }, [algorithm]);

  const handleRun = () => {
    let data;
    if (inputMode === 'manual') {
      data = parseAndValidate(manualValue);
      if (data === null) return;
    } else {
      data = generateRandomData(algorithm);
    }
    onRun(data);
  };

  const handleRandom = () => {
    setInputMode('random');
    const data = generateRandomData(algorithm);
    setManualValue(Array.isArray(data) ? data.join(', ') : String(data));
    setError('');
  };

  const handleTestCase = (tc) => {
    setInputMode('testcase');
    setManualValue(Array.isArray(tc.input) ? tc.input.join(', ') : String(tc.input));
    setError('');
    onRun(tc.input);
  };

  return (
    <div className="panel">
      <h3 className="panel-title">📥 测试数据</h3>

      <div className="input-tabs">
        <button className={`input-tab ${inputMode === 'manual' ? 'active' : ''}`} onClick={() => { setInputMode('manual'); setError(''); }}>
          手动输入
        </button>
        <button className={`input-tab ${inputMode === 'random' ? 'active' : ''}`} onClick={handleRandom}>
          随机生成
        </button>
      </div>

      <div className="input-row">
        <input
          type="text"
          className={`text-input ${error ? 'input-error' : ''}`}
          value={manualValue}
          onChange={(e) => { setManualValue(e.target.value); setInputMode('manual'); setError(''); }}
          placeholder={algorithm.inputHint}
          disabled={disabled}
          onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
        />
      </div>
      {error && <p className="error-msg">⚠ {error}</p>}

      <button className="btn btn-primary btn-full" onClick={handleRun} disabled={disabled}>
        ▶ 执行算法
      </button>

      {testCases.length > 0 && (
        <>
          <h4 className="section-subtitle">标准测试用例</h4>
          <div className="testcases-list">
            {testCases.map((tc) => (
              <div key={tc.id} className="testcase-chip" onClick={() => handleTestCase(tc)} title={tc.description}>
                <span className="testcase-chip-name">{tc.name}</span>
                <span className="testcase-chip-preview">
                  {Array.isArray(tc.input) ? `[${tc.input.slice(0, 3).join(',')}${tc.input.length > 3 ? '…' : ''}]` : tc.input}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
