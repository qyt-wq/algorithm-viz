import { useMemo } from 'react';

const NODE_RADIUS = 20;
const COLORS = {
  leaf: '#6c5ce7',
  internal: '#a29bfe',
  selected: '#fdcb6e',
  merged: '#00b894',
  edge: '#636e72',
};

function countLeaves(node) {
  if (!node) return 0;
  if (!node.left && !node.right) return 1;
  return countLeaves(node.left) + countLeaves(node.right);
}

function layoutTree(node, x, y, availableWidth, levelHeight = 70) {
  if (!node) return [];
  const leaves = countLeaves(node);
  const totalWidth = availableWidth;
  const result = [];

  const layout = (n, lx, rx, cy) => {
    if (!n) return;
    const cx = (lx + rx) / 2;
    result.push({ ...n, _x: cx, _y: cy });
    if (n.left || n.right) {
      const childY = cy + levelHeight;
      if (n.left) {
        const lw = countLeaves(n.left);
        layout(n.left, lx, lx + (lw / leaves) * totalWidth, childY);
      }
      if (n.right) {
        const rw = countLeaves(n.right);
        layout(n.right, rx - (rw / leaves) * totalWidth, rx, childY);
      }
    }
  };
  layout(node, x, x + totalWidth, y);
  return result;
}

function layoutForest(nodes) {
  const trees = nodes.map((node) => ({ root: node, leafCount: countLeaves(node) }));
  const totalLeaves = trees.reduce((s, t) => s + t.leafCount, 0);
  const totalWidth = Math.max(500, totalLeaves * 60);
  const spacing = totalWidth / (trees.length + 1);

  const positionedNodes = [];
  trees.forEach((tree, i) => {
    const x = spacing * (i + 1) - (tree.leafCount * 60) / 2;
    positionedNodes.push(...layoutTree(tree.root, x, 50, tree.leafCount * 60));
  });
  return { positionedNodes, totalWidth };
}

function getDepth(n) {
  if (!n) return 0;
  return 1 + Math.max(getDepth(n.left), getDepth(n.right));
}

export default function HuffmanViz({ step, steps, currentIndex }) {
  const nodes = step.nodes || [];

  const { positionedNodes, svgWidth, svgHeight } = useMemo(() => {
    if (!nodes.length) return { positionedNodes: [], svgWidth: 600, svgHeight: 400 };

    if (step.type === 'complete' && step.root) {
      const leaves = countLeaves(step.root);
      const w = Math.max(550, leaves * 60);
      const h = 70 * Math.ceil(Math.log2(leaves)) + 140;
      return {
        positionedNodes: layoutTree(step.root, 20, w - 20, w - 40),
        svgWidth: w,
        svgHeight: Math.max(400, h),
      };
    }

    const { positionedNodes: pos, totalWidth } = layoutForest(nodes);
    let maxDepth = 1;
    for (const n of nodes) maxDepth = Math.max(maxDepth, getDepth(n));
    return {
      positionedNodes: pos,
      svgWidth: totalWidth,
      svgHeight: Math.max(340, maxDepth * 70 + 140),
    };
  }, [nodes, step.type, step.root]);

  const selectedLeftId = step.selectedLeft?.id;
  const selectedRightId = step.selectedRight?.id;
  const mergedNodeId = step.mergedNode?.id;

  const getNodeColor = (node) => {
    if (node.id === mergedNodeId) return COLORS.merged;
    if (node.id === selectedLeftId || node.id === selectedRightId) return COLORS.selected;
    if (node.char) return COLORS.leaf;
    return COLORS.internal;
  };

  const posMap = useMemo(() => {
    const map = new Map();
    positionedNodes.forEach((n) => map.set(n.id, { x: n._x, y: n._y }));
    return map;
  }, [positionedNodes]);

  return (
    <div className="huffman-viz">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="huffman-tree-svg">
        {/* 树枝边 */}
        {positionedNodes.map((node) => (
          <g key={`edges-${node.id}`}>
            {node.left && posMap.has(node.left.id) && (
              <line
                x1={node._x} y1={node._y}
                x2={posMap.get(node.left.id).x} y2={posMap.get(node.left.id).y}
                stroke={COLORS.edge} strokeWidth={1.5}
              />
            )}
            {node.right && posMap.has(node.right.id) && (
              <line
                x1={node._x} y1={node._y}
                x2={posMap.get(node.right.id).x} y2={posMap.get(node.right.id).y}
                stroke={COLORS.edge} strokeWidth={1.5}
              />
            )}
          </g>
        ))}

        {/* 节点 */}
        {positionedNodes.map((node) => {
          const color = getNodeColor(node);
          const isSelected = node.id === selectedLeftId || node.id === selectedRightId;
          const isMerged = node.id === mergedNodeId;

          return (
            <g key={node.id}>
              <circle
                cx={node._x} cy={node._y} r={NODE_RADIUS}
                fill={color}
                stroke={isSelected ? '#e17055' : 'white'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className={`huffman-node ${isMerged ? 'huffman-node-merged' : ''}`}
              />
              <text x={node._x} y={node._y + 1} textAnchor="middle" fontSize={11} fill="white" fontWeight="bold">
                {node.char || '*'}
              </text>
              <text x={node._x} y={node._y + NODE_RADIUS + 13} textAnchor="middle" fontSize={10}
                fill="#b0b8c8" fontFamily="var(--font-mono)">
                {node.freq}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 完成状态 — 编码表 */}
      {step.type === 'complete' && step.codes && (
        <div className="huffman-codes-table">
          <div className="huffman-codes-title">📋 哈夫曼编码表</div>
          <div className="huffman-codes-grid">
            {Object.entries(step.codes).sort(([a], [b]) => a.localeCompare(b)).map(([char, code]) => (
              <div key={char} className="huffman-code-row">
                <span className="huffman-code-char">'{char}'</span>
                <span className="huffman-code-arrow">→</span>
                <span className="huffman-code-value">{code}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 图例 */}
      <div className="legend">
        <div className="legend-item"><span className="legend-dot" style={{ background: COLORS.leaf }} />叶子节点</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: COLORS.internal }} />内部节点</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: COLORS.selected }} />选中节点</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: COLORS.merged }} />新合并</div>
      </div>
    </div>
  );
}
