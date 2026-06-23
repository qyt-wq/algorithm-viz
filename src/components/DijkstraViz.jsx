import { useMemo } from 'react';

const NODE_RADIUS = 22;
const COLORS = {
  nodeDefault: '#5b8def',
  nodeCurrent: '#e74c3c',
  nodeVisited: '#95a5a6',
  nodeStart: '#2ecc71',
  edgeDefault: '#bdc3c7',
  edgeHighlight: '#f39c12',
  edgeRelaxed: '#2ecc71',
  edgePath: '#27ae60',
};

export default function DijkstraViz({ step, graphData, steps, currentIndex }) {
  if (!graphData) return <div className="empty-viz">无图数据</div>;

  const { nodes, edges } = graphData;

  // 动态计算 viewBox（根据节点位置自适应）
  const viewBox = useMemo(() => {
    if (!nodes || nodes.length === 0) return '0 0 400 500';
    const padding = 40;
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs) - padding;
    const minY = Math.min(...ys) - padding;
    const maxX = Math.max(...xs) + padding;
    const maxY = Math.max(...ys) + padding;
    const w = Math.max(400, maxX - minX);
    const h = Math.max(500, maxY - minY);
    return `${minX} ${minY} ${w} ${h}`;
  }, [nodes]);

  // 确定边颜色
  const getEdgeColor = (from, to) => {
    const isHighlighted = step.highlightedEdges?.some(
      (e) =>
        (e.from === from && e.to === to) ||
        (e.from === to && e.to === from)
    );
    const isRelaxed = step.relaxedEdges?.some(
      (e) =>
        (e.from === from && e.to === to) ||
        (e.from === to && e.to === from)
    );

    if (isRelaxed) return COLORS.edgeRelaxed;
    if (isHighlighted) return COLORS.edgeHighlight;
    return COLORS.edgeDefault;
  };

  const getEdgeWidth = (from, to) => {
    const isHighlighted = step.highlightedEdges?.some(
      (e) =>
        (e.from === from && e.to === to) ||
        (e.from === to && e.to === from)
    );
    const isRelaxed = step.relaxedEdges?.some(
      (e) =>
        (e.from === from && e.to === to) ||
        (e.from === to && e.to === from)
    );
    return isHighlighted || isRelaxed ? 2.5 : 1.5;
  };

  // 确定节点颜色
  const getNodeColor = (nodeId) => {
    // 起始节点
    if (steps[0]?.description?.includes(nodeId) && step.type === 'init') {
      return COLORS.nodeStart;
    }
    if (nodeId === step.current) return COLORS.nodeCurrent;
    if (step.visited?.has(nodeId)) return COLORS.nodeVisited;
    return COLORS.nodeDefault;
  };

  // 距离标签
  const getDistanceLabel = (nodeId) => {
    const dist = step.distances?.[nodeId];
    if (dist === undefined || dist === Infinity) return '∞';
    return dist;
  };

  return (
    <div className="dijkstra-viz">
      <svg viewBox={viewBox} className="graph-svg">
        {/* 边 */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          // 计算边中点（用于权重标签）
          const mx = (fromNode.x + toNode.x) / 2;
          const my = (fromNode.y + toNode.y) / 2;

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getEdgeColor(edge.from, edge.to)}
                strokeWidth={getEdgeWidth(edge.from, edge.to)}
                className="graph-edge"
              />
              {/* 权重标签 */}
              <rect
                x={mx - 12}
                y={my - 10}
                width={24}
                height={18}
                rx={9}
                fill="white"
                stroke="#ddd"
                strokeWidth={0.5}
              />
              <text
                x={mx}
                y={my + 3}
                textAnchor="middle"
                fontSize={11}
                fill="#555"
                fontWeight="bold"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* 节点 */}
        {nodes.map((node) => (
          <g key={`node-${node.id}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={getNodeColor(node.id)}
              stroke="white"
              strokeWidth={2.5}
              className={`graph-node ${node.id === step.current ? 'node-current' : ''}`}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fontSize={14}
              fill="white"
              fontWeight="bold"
            >
              {node.id}
            </text>
          </g>
        ))}

        {/* 距离标签 */}
        {nodes.map((node) => {
          const dist = getDistanceLabel(node.id);
          const isFinite = dist !== '∞';
          return (
            <g key={`dist-${node.id}`}>
              <rect
                x={node.x + NODE_RADIUS + 2}
                y={node.y - NODE_RADIUS - 2}
                width={32}
                height={20}
                rx={4}
                fill="white"
                stroke={isFinite ? '#2ecc71' : '#ddd'}
                strokeWidth={1}
                opacity={0.9}
              />
              <text
                x={node.x + NODE_RADIUS + 18}
                y={node.y - NODE_RADIUS + 12}
                textAnchor="middle"
                fontSize={11}
                fill={isFinite ? '#27ae60' : '#999'}
                fontWeight="bold"
              >
                {dist}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 图例 */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: COLORS.nodeCurrent }} />
          <span>当前节点</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: COLORS.nodeVisited }} />
          <span>已访问</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: COLORS.nodeStart }} />
          <span>起点</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: COLORS.edgeRelaxed }} />
          <span>已松弛/最短路径</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: COLORS.edgeHighlight }} />
          <span>检查中</span>
        </div>
      </div>
    </div>
  );
}
