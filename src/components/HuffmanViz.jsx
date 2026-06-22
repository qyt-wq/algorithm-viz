import { useMemo } from 'react';

const NODE_RADIUS = 20;
const LEAF_SPACING = 70;       // 每个叶子节点的水平空间
const TREE_PAD_X = 30;         // 树左右内边距
const TREE_GAP = 40;           // 森林中树之间的最小间距
const LEVEL_HEIGHT = 75;       // 层高
const TOP_Y = 50;              // 根节点起始Y

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

function getTreeDepth(n) {
  if (!n) return 0;
  return 1 + Math.max(getTreeDepth(n.left), getTreeDepth(n.right));
}

/** 计算一棵树所需的最小像素宽度 */
function treePixelWidth(leafCount) {
  return leafCount * LEAF_SPACING;
}

/**
 * 递归布局单棵树。
 * 保证同层节点最小间距 >= NODE_RADIUS * 3，避免图形重叠。
 */
function layoutTree(node, startX, y, totalWidth) {
  if (!node) return [];
  const result = [];

  const walk = (n, lx, rx, cy) => {
    if (!n) return;
    const cx = (lx + rx) / 2;
    result.push({ ...n, _x: cx, _y: cy });

    if (n.left || n.right) {
      const childY = cy + LEVEL_HEIGHT;
      if (n.left && n.right) {
        const lw = countLeaves(n.left);
        const rw = countLeaves(n.right);
        const width = rx - lx;
        // 按叶子数比例分配宽度，同时保证最小节点间距
        const minHalf = NODE_RADIUS * 1.5;
        const idealSplit = lx + (lw / (lw + rw)) * width;
        const split = Math.max(lx + minHalf, Math.min(rx - minHalf, idealSplit));
        walk(n.left, lx, split, childY);
        walk(n.right, split, rx, childY);
      } else if (n.left) {
        walk(n.left, lx, rx, childY);
      } else {
        walk(n.right, lx, rx, childY);
      }
    }
  };
  walk(node, startX, startX + totalWidth, y);
  return result;
}

/**
 * 森林布局：多棵树按叶子数比例并排，互不重叠。
 */
function layoutForest(nodes) {
  const trees = nodes.map((node) => ({
    root: node,
    leafCount: countLeaves(node),
  }));
  const widths = trees.map((t) => treePixelWidth(t.leafCount));
  const totalWidth = widths.reduce((s, w) => s + w, 0)
    + TREE_GAP * (trees.length - 1)
    + TREE_PAD_X * 2;

  const positionedNodes = [];
  let cursor = TREE_PAD_X;
  trees.forEach((tree, i) => {
    positionedNodes.push(...layoutTree(tree.root, cursor, TOP_Y, widths[i]));
    cursor += widths[i] + TREE_GAP;
  });
  return { positionedNodes, totalWidth: Math.max(500, totalWidth) };
}

export default function HuffmanViz({ step, steps, currentIndex }) {
  const nodes = step.nodes || [];

  const { positionedNodes, svgWidth, svgHeight } = useMemo(() => {
    if (!nodes.length) return { positionedNodes: [], svgWidth: 600, svgHeight: 340 };

    // ---- 完成状态：单棵完整树 ----
    if (step.type === 'complete' && step.root) {
      const leaves = countLeaves(step.root);
      const w = treePixelWidth(leaves) + TREE_PAD_X * 2;
      const depth = getTreeDepth(step.root);
      const h = TOP_Y + depth * LEVEL_HEIGHT + NODE_RADIUS + 20;
      return {
        positionedNodes: layoutTree(step.root, TREE_PAD_X, TOP_Y, treePixelWidth(leaves)),
        svgWidth: Math.max(550, w),
        svgHeight: Math.max(400, h),
      };
    }

    // ---- 森林状态：多棵树并排 ----
    const { positionedNodes: pos, totalWidth } = layoutForest(nodes);
    let maxDepth = 1;
    for (const n of nodes) maxDepth = Math.max(maxDepth, getTreeDepth(n));
    const h = TOP_Y + maxDepth * LEVEL_HEIGHT + NODE_RADIUS + 20;
    return {
      positionedNodes: pos,
      svgWidth: totalWidth,
      svgHeight: Math.max(340, h),
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

  const isComplete = step.type === 'complete' && step.root;

  return (
    <div className={`huffman-viz${isComplete ? ' huffman-complete' : ''}`}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="huffman-tree-svg" preserveAspectRatio="xMidYMid meet">
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
