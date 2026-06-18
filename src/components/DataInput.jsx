import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_GRAPH, autoLayout } from '../algorithms/dijkstra';

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

/**
 * 解析边文本为图数据
 * 格式：每行 "from to weight"（空格/逗号/制表符分隔）
 * @returns {{ nodes: {id,x,y}[], edges: {from,to,weight}[] } | null}
 */
function parseEdgeText(text) {
  const lines = text.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const edges = [];
  const nodeSet = new Set();
  const seenEdges = new Set();

  for (const line of lines) {
    // 支持空格、制表符、逗号作为分隔符
    const parts = line.split(/[\s,\t]+/).filter(Boolean);
    if (parts.length < 3) return { error: `格式错误：每行需要 "from to weight" 三个部分，收到: "${line}"` };
    if (parts.length > 3) return { error: `格式错误：每行只能有 from、to、weight，收到 ${parts.length} 个部分: "${line}"` };

    const [from, to, weightStr] = parts;
    const weight = Number(weightStr);
    if (isNaN(weight) || !Number.isFinite(weight) || weight <= 0) {
      return { error: `权重必须是正数: "${weightStr}" (行: "${line}")` };
    }

    // 检查重复边
    const key = [from, to].sort().join('-');
    if (seenEdges.has(key)) {
      return { error: `重复定义边 "${from}-${to}"` };
    }
    seenEdges.add(key);

    edges.push({ from, to, weight });
    nodeSet.add(from);
    nodeSet.add(to);
  }

  if (nodeSet.size < 2) return { error: '至少需要2个节点' };
  if (edges.length === 0) return { error: '至少需要1条边' };

  const nodeIds = [...nodeSet];
  const nodes = autoLayout(nodeIds);

  return { nodes, edges };
}

// 将内置图转换为边文本格式（用于预填充）
function graphToEdgeText(graph) {
  return graph.edges
    .map(e => `${e.from} ${e.to} ${e.weight}`)
    .join('\n');
}

export default function DataInput({ algorithm, onRun, disabled, testCases }) {
  const [inputMode, setInputMode] = useState('manual');
  const [manualValue, setManualValue] = useState('');
  const [error, setError] = useState('');

  // ---- Dijkstra 自定义图专用状态 ----
  const [graphMode, setGraphMode] = useState('builtin'); // 'builtin' | 'custom'
  const [edgeText, setEdgeText] = useState(() => graphToEdgeText(DEFAULT_GRAPH));
  const [graphError, setGraphError] = useState('');

  // 可用的节点列表（用于起始节点选择器）
  const availableNodes = useMemo(() => {
    if (algorithm.id !== 'dijkstra') return [];
    if (graphMode === 'builtin') {
      return DEFAULT_GRAPH.nodes.map(n => n.id);
    }
    // 自定义模式 — 从边文本解析
    const parsed = parseEdgeText(edgeText);
    if (parsed && !parsed.error) {
      return parsed.nodes.map(n => n.id).sort();
    }
    return [];
  }, [algorithm.id, graphMode, edgeText]);

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
      // 验证起始节点在可用节点列表中
      if (!availableNodes.includes(val)) {
        setError(`请输入有效起始节点（${availableNodes.join(', ')}）`);
        return null;
      }
      return val;
    }
    if (algorithm.id === 'hanoi') {
      const n = parseInt(raw.trim(), 10);
      if (isNaN(n) || n < 2 || n > 8) { setError('请输入2-8之间的整数'); return null; }
      return n;
    }
    return null;
  }, [algorithm, availableNodes]);

  const handleRun = () => {
    if (algorithm.id === 'dijkstra' && graphMode === 'custom') {
      // 自定义图模式
      const parsed = parseEdgeText(edgeText);
      if (parsed.error) {
        setGraphError(parsed.error);
        return;
      }
      setGraphError('');
      const startNode = parseAndValidate(manualValue);
      if (startNode === null) return;
      onRun({ startNode, graph: { nodes: parsed.nodes, edges: parsed.edges } });
      return;
    }

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
    if (algorithm.id === 'dijkstra') {
      setGraphMode('builtin');
    }
  };

  const handleTestCase = (tc) => {
    setInputMode('testcase');
    setError('');
    setGraphError('');

    if (algorithm.id === 'dijkstra' && typeof tc.input === 'object' && tc.input.graph) {
      // 测试用例包含自定义图
      setGraphMode('custom');
      setEdgeText(graphToEdgeText(tc.input.graph));
      setManualValue(tc.input.startNode);
      onRun({ startNode: tc.input.startNode, graph: tc.input.graph });
    } else if (algorithm.id === 'dijkstra') {
      setGraphMode('builtin');
      setManualValue(String(tc.input));
      onRun(tc.input);
    } else {
      setManualValue(Array.isArray(tc.input) ? tc.input.join(', ') : String(tc.input));
      onRun(tc.input);
    }
  };

  // 当切换到自定义图模式时，初始化编辑文本
  const handleGraphModeChange = (mode) => {
    setGraphMode(mode);
    setGraphError('');
    if (mode === 'custom') {
      // 预填充当前内置图的边
      if (!edgeText.trim()) {
        setEdgeText(graphToEdgeText(DEFAULT_GRAPH));
      }
    }
  };

  // 当算法切换时重置图模式
  const algoId = algorithm.id;

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

      {/* ---- Dijkstra 图模式切换 ---- */}
      {algoId === 'dijkstra' && (
        <div className="input-tabs" style={{ marginTop: 4 }}>
          <button
            className={`input-tab ${graphMode === 'builtin' ? 'active' : ''}`}
            onClick={() => handleGraphModeChange('builtin')}
          >
            🗺️ 内置图
          </button>
          <button
            className={`input-tab ${graphMode === 'custom' ? 'active' : ''}`}
            onClick={() => handleGraphModeChange('custom')}
          >
            ✏️ 自定义图
          </button>
        </div>
      )}

      {/* ---- 起始节点输入（Dijkstra） ---- */}
      {algoId === 'dijkstra' && graphMode === 'builtin' && (
        <>
          <div className="input-row">
            <input
              type="text"
              className={`text-input ${error ? 'input-error' : ''}`}
              value={manualValue}
              onChange={(e) => { setManualValue(e.target.value.toUpperCase()); setInputMode('manual'); setError(''); }}
              placeholder="输入起始节点（A-G）"
              disabled={disabled}
              maxLength={1}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
            />
          </div>
          {error && <p className="error-msg">⚠ {error}</p>}
        </>
      )}

      {/* ---- 自定义图编辑器 ---- */}
      {algoId === 'dijkstra' && graphMode === 'custom' && (
        <div className="graph-editor">
          {/* 起始节点选择 */}
          <div className="graph-editor-section">
            <label className="graph-editor-label">起始节点</label>
            {availableNodes.length > 0 ? (
              <div className="node-picker">
                {availableNodes.map((n) => (
                  <button
                    key={n}
                    className={`node-pick-btn ${manualValue.toUpperCase() === n ? 'active' : ''}`}
                    onClick={() => { setManualValue(n); setError(''); }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            ) : (
              <p className="graph-editor-hint">请先在下方定义节点和边</p>
            )}
          </div>

          {/* 边定义文本区 */}
          <div className="graph-editor-section">
            <label className="graph-editor-label">
              边定义 <span className="graph-editor-format">（格式: from to weight，每行一条）</span>
            </label>
            <textarea
              className={`graph-edge-textarea ${graphError ? 'input-error' : ''}`}
              value={edgeText}
              onChange={(e) => { setEdgeText(e.target.value); setGraphError(''); }}
              placeholder={'A B 4\nA C 2\nB C 1\nB D 5\n...'}
              rows={6}
              disabled={disabled}
              spellCheck={false}
            />
            {graphError && <p className="error-msg">⚠ {graphError}</p>}
          </div>
        </div>
      )}

      {/* ---- 非Dijkstra算法的普通输入 ---- */}
      {algoId !== 'dijkstra' && (
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
      )}
      {algoId !== 'dijkstra' && error && <p className="error-msg">⚠ {error}</p>}

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
                  {algoId === 'dijkstra' && typeof tc.input === 'object'
                    ? `图:${tc.input.graph.nodes.length}节点/${tc.input.graph.edges.length}边, 起点:${tc.input.startNode}`
                    : Array.isArray(tc.input)
                      ? `[${tc.input.slice(0, 3).join(',')}${tc.input.length > 3 ? '…' : ''}]`
                      : tc.input}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
